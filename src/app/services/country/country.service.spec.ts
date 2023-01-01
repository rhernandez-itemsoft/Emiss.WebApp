import { routes } from 'src/app/app-routing.module';
import { CountryFilter, CountryModel } from 'src/app/models/country-model';
import { HttpResponseApi } from 'src/app/models/httpResponseApi';
import { Base64 } from 'src/app/utils/base64/base64';
import { DtUtils } from 'src/app/utils/data-table/dt-utils/dt-utils';
import { DtRequest } from 'src/app/utils/data-table/models/dt-request';
import { ApiName, EndpointName, environment as env } from 'src/environment';

import {
    HTTP_INTERCEPTORS, HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpResponse
} from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { CountryService } from './country.service';
import { HttpErrorInterceptor } from 'src/app/interceptors/http-error.interceptor';

describe('CountryService', () => {
    let service: CountryService;
    let controller: HttpTestingController;
    let client: HttpClient;
    let dtUtils: DtUtils<CountryModel, CountryFilter>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', useHash: false }),
            ],
            providers: [
                CountryService,
                { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
            ]
        });

        client = TestBed.inject(HttpClient);
        dtUtils = new DtUtils<CountryModel, CountryFilter>( 'countryId',EndpointName.Country)

        controller = TestBed.inject(HttpTestingController);
        service = TestBed.inject(CountryService);

        spyOn(Base64, 'toFile').and.callFake(()=>{
            return ;
          });
    });


    it('getAll - OK', () => {
        const _dataMock = <CountryModel[]>[
            {
                countryId: 1,
                code: "Test",
                abbreviation: "Test",
                name: "Test",
                enabled: true
            }
        ];

        let _filterMock: CountryFilter = <CountryFilter>{
            countryId: null,
            code: "",
            abbreviation: "",
            name: "",
            enabled: ''
        };

        service.getAll(_filterMock)
            .subscribe({
                next(_httpResponse: HttpResponse<HttpResponseApi<CountryModel[] | null>>) {
                    expect(_httpResponse).toBeTruthy();
                    expect(_httpResponse.status).toEqual(200);
                    expect(_httpResponse.body).not.toBeNull();
                    expect(_httpResponse.body?.code).toEqual(200);
                    expect(_httpResponse.body?.data).toEqual(_dataMock);
                },
            });



        let _requestDt: DtRequest | any = new DtRequest();
        _requestDt = dtUtils.wrapRequestWithFilters(null);
        _requestDt.fields = 'countryId,name';
        _requestDt.sortField = 'name';
        _requestDt.allowPaging = false;

        if (_filterMock != null) {
            for (let key in _filterMock) {
                let value = (<any>_filterMock)[key];
                _requestDt[key] = value;
            }
        }


        const _urlMock: string = env.getUlrApi(ApiName.Default, EndpointName.Country); //`${ApiName.Default}${EndpointName.Country}`;

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
        const _dataMock = <CountryModel[]>[
            {
                countryId: 1,
                code: "Test",
                abbreviation: "Test",
                name: "Test",
                enabled: true
            }
        ];

        let _filterMock: CountryFilter = <CountryFilter>{
            countryId: null,
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
        _requestDt.fields = 'countryId,name';
        _requestDt.sortField = 'name';
        _requestDt.allowPaging = false;

        if (_filterMock != null) {
            for (let key in _filterMock) {
                let value = (<any>_filterMock)[key];
                _requestDt[key] = value;
            }
        }

        const _urlMock: string = `${ApiName.Default}${EndpointName.Country}`;

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