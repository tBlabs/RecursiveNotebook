import { Observable } from 'rxjs/Rx';
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpResourceService } from './http-resource.service';
import { Http, HttpModule, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { MockResponseHelper } from './mock-backend';
import { Fault } from './../testing/utils';

describe('HttpResourceService<>', () =>
{
  const API_URL = 'api/resource';
  let _httpResource: HttpResourceService<any> = null;
  let _mockBackend: MockBackend = null;
  let _mockResponseHelper: MockResponseHelper = null;

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
  }); // beforeEach

  beforeEach(inject([HttpResourceService, MockBackend], (httpResource: HttpResourceService<any>, mockBackend: MockBackend) =>
  {
    _httpResource = httpResource;
    _mockBackend = mockBackend;

    _httpResource.SetResourceUrl(API_URL);
    _mockResponseHelper = new MockResponseHelper(_mockBackend);
  }));

  describe('ReadMany()', () =>
  {
    it('should return single object', () =>
    {
      const EXPECTED_RESPOND = [{ foo: "bar" }];

      _mockResponseHelper.Config({
        request: { method: RequestMethod.Get, url: API_URL + '/123' }, // Tested function (one of HttpRequest method) should hit backend connection with such request
        respond: { status: 200, body: EXPECTED_RESPOND } // This is the answer from backend connection
      });

      spyOn(_httpResource, 'ReadMany').and.callThrough();

      _httpResource.ReadMany('123').subscribe(ret =>
      {
        expect(ret).toEqual(EXPECTED_RESPOND);
      });

      expect(_httpResource.ReadMany).toHaveBeenCalled();
    });

    it('should return error on non-existing collection', () =>
    {
      _mockResponseHelper.Config({
        request: { method: RequestMethod.Get, url: API_URL + '/666' }, // Tested function (one of HttpRequest method) should hit backend connection with such request
        respond: { status: 404, body: null } // This is the answer from backend connection
      });

      spyOn(_httpResource, 'ReadMany').and.callThrough();

      _httpResource.ReadMany('666').subscribe(ret =>
      {
        Fault(); // this should never happend!
      },
      (err)=>
      { 
        expect(err).toBeDefined();
      });

      expect(_httpResource.ReadMany).toHaveBeenCalled();
    });

  }); //  describe('ReadMany()'...

}); // describe
