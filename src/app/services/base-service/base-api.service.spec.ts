
import { HttpErrorInterceptor } from 'src/app/interceptors/http-error.interceptor';
import { EndpointModel } from 'src/app/models/endpoint-model';
import { HttpResponseApi } from 'src/app/models/httpResponseApi';
import { createTranslateLoader } from 'src/app/modules/prime.module';
import { Base64 } from 'src/app/utils/base64/base64';
import { DtRequest } from 'src/app/utils/data-table/models/dt-request';
import { ApiName, EndpointName, environment as env } from 'src/environments/environment';

import {
    HTTP_INTERCEPTORS, HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpResponse
} from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { routes } from '../../app-routing.module';
import { BaseApiService } from './base-api.service';

describe('BaseApiService', () => {
    let service: BaseApiService;
    let controller: HttpTestingController;

    const _apiName: ApiName = ApiName.Default;
    const _endpointName: EndpointName = EndpointName.Endpoint;

    const _dataMock: EndpointModel = <EndpointModel>{
        endpointId: 1,
        name: 'Test',
        description: 'Any Description',
        enabled: true,
    };
    let _dataArrayMock: EndpointModel[] = <EndpointModel[]>[];
    for (let idx = 1; idx < 11; idx++) {
        _dataArrayMock.push(
            <EndpointModel>{
                endpointId: idx,
                name: 'Test - ' + idx.toString(),
                description: 'Any Description - ' + idx.toString(),
                enabled: true,
            }
        );
    }


    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (createTranslateLoader),
                        deps: [HttpClient]
                    }
                }),
                HttpClientTestingModule,
                RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', useHash: false }),
            ],
            providers: [
                BaseApiService,
                TranslateService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: HttpErrorInterceptor,
                    multi: true
                },
            ]
        });


        controller = TestBed.inject(HttpTestingController);
        service = TestBed.inject(BaseApiService);

        spyOn(Base64, 'toFile').and.callFake(() => {
            return;
        });
    });

    describe(' Response OK', () => {

        it('200 [GET] - getById<T>', () => {
            const urlMock: string = env.getUlrApi(_apiName, `${_endpointName}/${_dataMock.endpointId}`);

            service.get<EndpointModel>(_apiName, `${_endpointName}/${_dataMock.endpointId}`, null)
                .subscribe({
                    next(_httpResponse: HttpResponse<HttpResponseApi<EndpointModel | null>>) {
                        expect(_httpResponse).toBeTruthy();
                        expect(_httpResponse.status).toEqual(200);
                        expect(_httpResponse.body?.code).toEqual(200);
                        expect(_httpResponse.body?.data).toEqual(_dataMock);
                    },
                });


            const req = controller.expectOne(urlMock);
            req.flush(
                {
                    code: 200,
                    data: _dataMock,
                    message: ""
                },
                {
                    status: 200,
                    statusText: 'Not Found',
                    headers: new HttpHeaders().set('Content-Type', 'application/json')
                }
            );
            controller.verify();
        });

        it('200 [GET] - getPaginate<T>', () => {
            const urlMock: string = env.getUlrApi(_apiName, `${_endpointName}`);

            let _requestDt: DtRequest | any = new DtRequest();
            _requestDt.fields = 'endpointId,name';
            _requestDt.sortField = 'name';
            _requestDt.allowPaging = false;
            _requestDt.enabled = true;


            service.get<EndpointModel[]>(_apiName, `${_endpointName}`, _requestDt)
                .subscribe({
                    next(_httpResponse: HttpResponse<HttpResponseApi<EndpointModel[] | null>>) {
                        expect(_httpResponse).toBeTruthy();

                        expect(_httpResponse.status).toEqual(200);
                        expect(_httpResponse.body?.code).toEqual(200);
                        expect(_httpResponse.body?.data).not.toBeNull();
                        expect(_httpResponse.body?.data?.length).toBeGreaterThan(0);
                        expect(_httpResponse.body?.data).toEqual(_dataArrayMock);
                    },
                });


            let _params: HttpParams = new HttpParams().appendAll(_requestDt);
            let httpReq: HttpRequest<any> = new HttpRequest('GET', urlMock, { params: _params, observe: 'response' });
            let requestMock = controller.expectOne((req: HttpRequest<any>) =>
                req.method === httpReq.method && req.urlWithParams === httpReq.urlWithParams
            );
            requestMock.flush(
                {
                    code: 200,
                    data: _dataArrayMock,
                    message: 'ok',
                },
                {
                    status: 200,
                    statusText: 'ok',
                    headers: new HttpHeaders().set('Content-Type', 'application/json')
                }
            );
            controller.verify();

        });

        it('200 [GET] - exportCsv', () => {
            const urlMock: string = env.getUlrApi(_apiName, `${_endpointName}/ExportCsv`);

            let _requestDt: DtRequest | any = new DtRequest();
            _requestDt.fields = 'endpointId,name';
            _requestDt.exportFields = 'endpointId,name';
            _requestDt.sortField = 'name';
            _requestDt.allowPaging = false;
            _requestDt.enabled = true;
            const _dataRequestMock = 'the_token';

            service.get<string>(_apiName, `${_endpointName}`, _requestDt)
                .subscribe({
                    next(_httpResponse: HttpResponse<HttpResponseApi<string | null>>) {
                        expect(_httpResponse).toBeTruthy();
                        expect(_httpResponse.status).toEqual(200);
                        expect(_httpResponse.body?.code).toEqual(200);
                        expect(_httpResponse.body?.data?.length).toBeGreaterThan(0);
                        expect(_httpResponse.body?.data).toEqual(_dataRequestMock);
                    },
                });


            let _params: HttpParams = new HttpParams().appendAll(_requestDt);
            let httpReq: HttpRequest<any> = new HttpRequest('GET', urlMock, { params: _params, observe: 'response' });


            let requestMock = controller.expectOne((req: HttpRequest<any>) => {
                return req.method === httpReq.method && req.urlWithParams === httpReq.urlWithParams
            });


            requestMock.flush(
                {
                    code: 200,
                    data: _dataRequestMock,
                    message: ""
                },
                {
                    status: 200,
                    statusText: 'OK',
                    headers: new HttpHeaders().set('Content-Type', 'application/json')
                }
            );
            controller.verify();
        });

        it('200 [GET] - exportPdf', () => {
            const urlMock: string = env.getUlrApi(_apiName, `${_endpointName}/ExportPdf`);

            let _requestDt: DtRequest | any = new DtRequest();
            _requestDt.fields = 'endpointId,name';
            _requestDt.exportFields = 'endpointId,name';
            _requestDt.sortField = 'name';
            _requestDt.allowPaging = false;
            _requestDt.enabled = true;
            const _dataRequestMock = 'the_token';

            service.get<string>(_apiName, `${_endpointName}/ExportPdf`, _requestDt)
                .subscribe({
                    next(_httpResponse: HttpResponse<HttpResponseApi<string | null>>) {
                        expect(_httpResponse).toBeTruthy();
                        expect(_httpResponse.status).toEqual(200);
                        expect(_httpResponse.body?.code).toEqual(200);
                        expect(_httpResponse.body?.data?.length).toBeGreaterThan(0);
                        expect(_httpResponse.body?.data).toEqual(_dataRequestMock);
                    },
                });


            let _params: HttpParams = new HttpParams().appendAll(_requestDt);
            let httpReq: HttpRequest<any> = new HttpRequest('GET', urlMock, { params: _params, observe: 'response' });
            let requestMock = controller.expectOne((req: HttpRequest<any>) => {
                return req.method === httpReq.method && req.urlWithParams === httpReq.urlWithParams
            });


            requestMock.flush(
                {
                    code: 200,
                    data: _dataRequestMock,
                    message: ""
                },
                {
                    status: 200,
                    statusText: 'OK',
                    headers: new HttpHeaders().set('Content-Type', 'application/json')
                }
            );
            controller.verify();
        });

        it('200 [GET] - exportXls', () => {
            const urlMock: string = env.getUlrApi(_apiName, `${_endpointName}/ExportXls`);

            let _requestDt: DtRequest | any = new DtRequest();
            _requestDt.fields = 'endpointId,name';
            _requestDt.exportFields = 'endpointId,name';
            _requestDt.sortField = 'name';
            _requestDt.allowPaging = false;
            _requestDt.enabled = true;
            const _dataRequestMock = 'the_token';

            service.get<string>(_apiName, `${_endpointName}/ExportPdf`, _requestDt)
                .subscribe({
                    next(_httpResponse: HttpResponse<HttpResponseApi<string | null>>) {
                        expect(_httpResponse).toBeTruthy();
                        expect(_httpResponse.status).toEqual(200);
                        expect(_httpResponse.body?.code).toEqual(200);
                        expect(_httpResponse.body?.data?.length).toBeGreaterThan(0);
                        expect(_httpResponse.body?.data).toEqual(_dataRequestMock);
                    },
                });


            let _params: HttpParams = new HttpParams().appendAll(_requestDt);
            let httpReq: HttpRequest<any> = new HttpRequest('GET', urlMock, { params: _params, observe: 'response' });
            let requestMock = controller.expectOne((req: HttpRequest<any>) => {
                return req.method === httpReq.method && req.urlWithParams === httpReq.urlWithParams
            });


            requestMock.flush(
                {
                    code: 200,
                    data: _dataRequestMock,
                    message: ""
                },
                {
                    status: 200,
                    statusText: 'Not Found',
                    headers: new HttpHeaders().set('Content-Type', 'application/json')
                }
            );
            controller.verify();
        });

        it('201 [POST] - post<T>', () => {
            const urlMock: string = env.getUlrApi(_apiName, `${_endpointName}`);
            let _params = new HttpParams().appendAll(<any>_dataMock);

            service.post<EndpointModel>(_apiName, _endpointName, _dataMock)
                .subscribe({
                    next(_httpResponse: HttpResponse<HttpResponseApi<EndpointModel>>) {
                        expect(_httpResponse).toBeTruthy();
                        expect(_httpResponse.status).toEqual(201);
                        expect(_httpResponse.body?.code).toEqual(201);
                        expect(_httpResponse.body?.data).not.toBeNull();
                        expect(_httpResponse.body?.data).toEqual(_dataMock);
                    },
                });

            //  let httpReq: HttpRequest<EndpointModel> = new HttpRequest('POST', urlMock, _dataMock);
            const requestMock = controller.expectOne(urlMock);
            expect(requestMock.request.method).toEqual('POST');
            requestMock.flush(
                {
                    status: 201,
                    statusText: 'OK',
                    headers: new HttpHeaders().set('Content-Type', 'application/json'),
                    body: {
                        code: 201,
                        data: _dataMock,
                        message: ""
                    },
                }
            );
            controller.verify();
        });

        it('200 [PUT] - post<T>', () => {
            const urlMock: string = env.getUlrApi(_apiName, `${_endpointName}/${_dataMock.endpointId}`);
            let _params = new HttpParams().appendAll(<any>_dataMock);

            service.put<EndpointModel>(_apiName, `${_endpointName}/${_dataMock.endpointId}`, _dataMock)
                .subscribe({
                    next(_httpResponse: HttpResponse<HttpResponseApi<EndpointModel>>) {
                        expect(_httpResponse).toBeTruthy();
                        expect(_httpResponse.status).toEqual(200);
                        expect(_httpResponse.body?.code).toEqual(200);
                        expect(_httpResponse.body?.data).not.toBeNull();
                        expect(_httpResponse.body?.data).toEqual(_dataMock);
                    },
                });

            const requestMock = controller.expectOne(urlMock);
            expect(requestMock.request.method).toEqual('PUT');
            requestMock.flush(
                {
                    status: 200,
                    statusText: 'OK',
                    headers: new HttpHeaders().set('Content-Type', 'application/json'),
                    body: {
                        code: 200,
                        data: _dataMock,
                        message: ""
                    },
                }
            );
            controller.verify();
        });

        it('200 [PATCH] - post<T>', () => {
            const urlMock: string = env.getUlrApi(_apiName, `${_endpointName}/${_dataMock.endpointId}`);
            // let _params = new HttpParams().appendAll(<any>_dataMock);

            service.patch<EndpointModel>(_apiName, `${_endpointName}/${_dataMock.endpointId}`, _dataMock)
                .subscribe({
                    next(_httpResponse: HttpResponse<HttpResponseApi<EndpointModel>>) {
                        expect(_httpResponse).toBeTruthy();
                        expect(_httpResponse.status).toEqual(200);
                        expect(_httpResponse.body?.code).toEqual(200);
                        expect(_httpResponse.body?.data).not.toBeNull();
                        expect(_httpResponse.body?.data).toEqual(_dataMock);
                    },
                });

            // let httpReq: HttpRequest<EndpointModel> = new HttpRequest('PUT', urlMock, _dataMock);
            const requestMock = controller.expectOne(urlMock);
            expect(requestMock.request.method).toEqual('PATCH');
            requestMock.flush(
                {
                    status: 200,
                    statusText: 'OK',
                    headers: new HttpHeaders().set('Content-Type', 'application/json'),
                    body: {
                        code: 200,
                        data: _dataMock,
                        message: ""
                    },
                }
            );
            controller.verify();
        });

        it('204 [DELETE] - post<T>', () => {
            const urlMock: string = env.getUlrApi(_apiName, `${_endpointName}/${_dataMock.endpointId}`);
            // let _params = new HttpParams().appendAll(<any>_dataMock);

            service.delete(_apiName, `${_endpointName}/${_dataMock.endpointId}`)
                .subscribe({
                    next(_httpResponse: HttpResponse<HttpResponseApi<boolean>>) {
                        expect(_httpResponse).toBeTruthy();
                        expect(_httpResponse.status).toEqual(204);
                        expect(_httpResponse.body?.code).toEqual(204);
                        expect(_httpResponse.body?.data).not.toBeNull();
                        expect(_httpResponse.body?.data).toEqual(true);
                    },
                });

            // let httpReq: HttpRequest<EndpointModel> = new HttpRequest('PUT', urlMock, _dataMock);
            const requestMock = controller.expectOne(urlMock);
            expect(requestMock.request.method).toEqual('DELETE');
            requestMock.flush(
                {
                    status: 204,
                    statusText: 'OK',
                    headers: new HttpHeaders().set('Content-Type', 'application/json'),
                    body: {
                        code: 204,
                        data: true,
                        message: ""
                    },
                }
            );

            controller.verify();
        });



    });


    it('getById Error Response with status = 0', () => {
        const urlMock: string = env.getUlrApi(_apiName, `${_endpointName}/${_dataMock.endpointId}`);

        service.get<EndpointModel>(_apiName, `${_endpointName}/${_dataMock.endpointId}`, null)
            .subscribe({
                next(responseOk) {
                    expect(responseOk).toBeTruthy();
                },
                error(error) {
                    expect(error.status).toBeGreaterThanOrEqual(503);
                }
            });


        const req = controller.expectOne(urlMock);

        req.flush(
            'Not Found',
            {
                status: 0,
                statusText: 'Not Found',
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            });

        controller.verify();
    });
    //https://www.concretepage.com/angular/angular-test-http-post#post

});



// https://stackoverflow.com/questions/63248288/angular-10-unit-testing-with-a-httpinterceptor-that-modifies-the-response-not-g