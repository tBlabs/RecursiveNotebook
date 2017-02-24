import { Response } from '@angular/http';
import { HttpModule, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpResourceService<T>
{
    private _resourceUrl: string = "";
    private headers = new Headers();

    constructor(private _http: Http) 
    {
        this.headers.append('Content-Type', 'application/json');
    }

    private HandleError(err: any): Observable<any>
    {
        console.log("[HandleError] " + err);

        return Observable.throw(err.statusText || "Server error");
    }

    public SetResourceUrl(url: string): void
    {
        this._resourceUrl = url + (url[url.length - 1] != '/' ? '/' : '');
    }

    public Create(obj: any): Observable<any>
    {
        let json = JSON.stringify(obj);

        return this._http.post(this._resourceUrl, json, { headers: this.headers })
            .map(d => d.json())
            .catch(err => this.HandleError(err));
    }

    public Read(appendToUrl: string): Observable<T>
    {
        return this._http.get(this._resourceUrl + appendToUrl)
            .map(d => d.json())
            .catch(err => this.HandleError(err));
    }

    public ReadMany(appendToUrl: string): Observable<T[]>
    {
        return this._http.get(this._resourceUrl + appendToUrl)
            .do((response: Response) =>
            {
                if (response.status != null && !response.ok)
                {
                    throw new Error(`Invalid status code (${ response.status })`);
                }
            })
            .map((d: Response) => d.json())
            .catch(err => this.HandleError(err));
    }

    public Update(appendToUrl: string, map: any): Observable<Response>
    {
        let patches = [];

        for (let key in map)
        {
            if (map.hasOwnProperty(key)) 
            {
                let patch =
                    {
                        op: 'replace',
                        path: '/' + key,
                        value: map[key]
                    };

                patches.push(patch);
            }
        }

        let jsonBody = JSON.stringify(patches);

        return this._http.patch(this._resourceUrl + appendToUrl, jsonBody, { headers: this.headers })
            .catch(err => this.HandleError(err));
    }

    public Delete(appendToUrl: string): Observable<Response>
    {
        return this._http.delete(this._resourceUrl + appendToUrl)
            .catch(err => this.HandleError(err));
    }

}