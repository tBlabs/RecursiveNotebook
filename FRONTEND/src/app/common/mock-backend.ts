
import { ResponseOptions, RequestMethod } from '@angular/http';
import { Response } from '@angular/http';
import { MockConnection, MockBackend } from '@angular/http/testing';

class RequestConfig
{
    public method: RequestMethod;
    public url: string;
}

class RespondConfig
{
    public status: number;
    public body: {};
}

class MockResponseConfig
{
    public request: RequestConfig;
    public respond: RespondConfig;
}

export class MockResponseHelper
{
    constructor(private _mockBackend: MockBackend) { }

    public Config(config: MockResponseConfig): void
    {
        this._mockBackend.connections.subscribe((connection: MockConnection) =>
        {
            if ((connection.request.method === config.request.method) &&
                (connection.request.url === config.request.url))
            {
                connection.mockRespond(new Response(new ResponseOptions(
                    {
                        body: config.respond.body,
                        status: config.respond.status
                    })));
            }
            else
            {
                throw `Request (method: ${connection.request.method}, url: ${connection.request.url}) with no respond!`;
            }
        });
    }
}