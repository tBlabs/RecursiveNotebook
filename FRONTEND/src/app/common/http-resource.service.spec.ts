import { Observable } from 'rxjs/Rx';
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpResourceService } from './http-resource.service';
import { Http } from '@angular/http';
import { HttpModule, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from "@angular/http/testing";
import { BaseRequestOptions, Response, ResponseOptions } from "@angular/http";

describe('HttpResourceService<>', () =>
{
  const API_URL = 'api/notes';

  beforeEach(() =>
  {
    TestBed.configureTestingModule(
      {
        imports:
        [
          HttpModule
        ],
        providers:
        [
          HttpResourceService,
          MockBackend,
          BaseRequestOptions,
          {
            provide: Http,
            deps: [MockBackend, BaseRequestOptions],
            useFactory: (backend: MockBackend, options: BaseRequestOptions) => new Http(backend, options)
          }
        ]
      });
  });//  beforeEach

  it('ReadMany test', inject([HttpResourceService, MockBackend], (httpResource: HttpResourceService<any>, mockBackend: MockBackend) =>
  {
    httpResource.SetResourceUrl(API_URL);
    let readManyUrlAppendix = "123/all";

    mockBackend.connections.subscribe((connection: MockConnection) =>
    {
      expect(connection.request.method).toBe(RequestMethod.Get, 'Invalid request method');
      expect(connection.request.url).toBe(API_URL + '/' + readManyUrlAppendix);

      if (connection.request.url == API_URL + '/' + readManyUrlAppendix)
      {
        connection.mockRespond(new Response(new ResponseOptions(
          {
            body: JSON.stringify(
              [
                { foo: "bar" },
                { foo: "bar2" },
              ]),
            status: 200
          }
          )));
      }
    });

    httpResource.ReadMany("123/all").subscribe(arr =>
    { 
      expect(arr.length).toBe(2);
      expect(arr[0]).toEqual({ foo: "bar" });
      expect(arr[1]).toEqual({ foo: "bar2" });
    },
    (e) => console.log("[httpResource.ReadMany] " + e)
    );

  })); // it

}); // describe
