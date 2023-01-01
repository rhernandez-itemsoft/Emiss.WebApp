import { routes } from 'src/app/app-routing.module';
import { HttpResponseApi } from 'src/app/models/httpResponseApi';
import { StateFilter, StateModel } from 'src/app/models/state-model';
import { Base64 } from 'src/app/utils/base64/base64';
import { DtUtils } from 'src/app/utils/data-table/dt-utils/dt-utils';
import { DtRequest } from 'src/app/utils/data-table/models/dt-request';
import { ApiName, EndpointName } from 'src/environment';

import {
    HTTP_INTERCEPTORS, HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpResponse
} from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { StateService } from './state.service';
import { HttpErrorInterceptor } from 'src/app/interceptors/http-error.interceptor';

describe('StateService', () => {
    let service: StateService;
    let controller: HttpTestingController;
    let client: HttpClient;
    let dtUtils: DtUtils<StateModel, StateFilter>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', useHash: false }),
            ],
            providers: [
                StateService,
                { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
            ]
        });

        client = TestBed.inject(HttpClient);
        dtUtils = new DtUtils<StateModel, StateFilter>( 'StateId',EndpointName.State)

        controller = TestBed.inject(HttpTestingController);
        service = TestBed.inject(StateService);

        spyOn(Base64, 'toFile').and.callFake(()=>{
            return ;
          });
    });


    it('getAll - OK', () => {
        const _dataMock = <StateModel[]>[
            {
                stateId: 1,
                code: "Test",
                abbreviation: "Test",
                name: "Test",
                enabled: true,
                countryId: 1,
            }
        ];

        let _filterMock: StateFilter = <StateFilter>{
            stateId: null,
            code: "",
            abbreviation: "",
            name: "",
            enabled: '',
            countryId: 1,
        };

        service.getAll(_filterMock)
            .subscribe({
                next(_httpResponse: HttpResponse<HttpResponseApi<StateModel[] | null>>) {
                    expect(_httpResponse).toBeTruthy();
                    expect(_httpResponse.status).toEqual(200);
                    expect(_httpResponse.body).not.toBeNull();
                    expect(_httpResponse.body?.code).toEqual(200);
                    expect(_httpResponse.body?.data).toEqual(_dataMock);
                },
            });



        let _requestDt: DtRequest | any = new DtRequest();
        _requestDt = dtUtils.wrapRequestWithFilters(null);
        _requestDt.fields = 'stateId,name';
        _requestDt.sortField = 'name';
        _requestDt.allowPaging = false;

        if (_filterMock != null) {
            for (let key in _filterMock) {
                let value = (<any>_filterMock)[key];
                _requestDt[key] = value;
            }
        }


        const _urlMock: string = `${ApiName.Default}${EndpointName.State}`;

        let _params: HttpParams = new HttpParams().appendAll(<any>_requestDt);
        let httpReq: HttpRequest<any> = new HttpRequest('GET', _urlMock, { params: _params, observe: 'response' });
        let requestMock = controller.expectOne((req: HttpRequest<any>) => {
          
            return req.method === httpReq.method && req.urlWithParams === httpReq.urlWithParams
        });

        requestMock.flush(
            {
                code: 200,
                data: _dataMock,
                message: ""
            }
        );
        controller.verify();
    });

    it('getAll - 404', () => {
        const _dataMock = <StateModel[]>[
            {
                stateId: 1,
                code: "Test",
                abbreviation: "Test",
                name: "Test",
                enabled: true
            }
        ];

        let _filterMock: StateFilter = <StateFilter>{
            stateId: null,
            code: "",
            abbreviation: "",
            name: "",
            enabled: ''
        };

        service.getAll(_filterMock)
            .subscribe({
                error(error) {
                    expect(error.status).toEqual(404);
                }
            });



        let _requestDt: DtRequest | any = new DtRequest();
        _requestDt = dtUtils.wrapRequestWithFilters(null);
        _requestDt.fields = 'stateId,name';
        _requestDt.sortField = 'name';
        _requestDt.allowPaging = false;

        if (_filterMock != null) {
            for (let key in _filterMock) {
                let value = (<any>_filterMock)[key];
                _requestDt[key] = value;
            }
        }

        const _urlMock: string = `${ApiName.Default}${EndpointName.State}`;

        let _params: HttpParams = new HttpParams().appendAll(_requestDt);
        let httpReq: HttpRequest<any> = new HttpRequest('GET', _urlMock, { params: _params, observe: 'response' });
        let requestMock = controller.expectOne((req: HttpRequest<any>) =>
            req.method === httpReq.method && req.urlWithParams === httpReq.urlWithParams
        );

        requestMock.flush(
            'Not Found',
            {
                status: 404,
                statusText: 'Not Found',
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }
        );
        controller.verify();
    });


});