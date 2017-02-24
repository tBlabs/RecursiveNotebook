import { HttpResourceService } from '../common/http-resource.service';
import { TabsModule } from './tabs.module';
import { Http, URLSearchParams, RequestOptionsArgs, ResponseContentType, Headers, Response } from '@angular/http';
import { Tab } from './tab.model';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

 
@Injectable()
export class TabsService
{
    private dataSource = 'http://localhost:63463/api/notes';

    constructor(private _httpResource: HttpResourceService<Tab>)
    {
        _httpResource.SetResourceUrl(this.dataSource);
    }

    public GetChildren(parentId: number): Observable<Tab[]> 
    {
        return this._httpResource.ReadMany(parentId.toString() + "/children");
    }

    public AddSibling(parentId: number, title: string): Observable<Tab> 
    {
        return this._httpResource.Create({ parentId: parentId, title: title });
    }

    public UpdateTitle(tab: Tab, newTitle: string): Observable<any>
    {
        return this._httpResource.Update(tab.id.toString(), { "title": newTitle });
    }

    public UpdateContent(tab: Tab): Observable<Response>
    {
        return this._httpResource.Update(tab.id.toString(), { "content": tab.content });
    }

    public Delete(id: number): Observable<Response>
    {
        return this._httpResource.Delete(id.toString());
    }
}
