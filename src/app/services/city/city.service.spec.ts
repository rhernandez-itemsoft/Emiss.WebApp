import { routes } from 'src/app/app-routing.module';
import { HttpErrorInterceptor } from 'src/app/interceptors/http-error.interceptor';
import { CityFilter, CityModel } from 'src/app/models/city-model';
import { HttpResponseApi } from 'src/app/models/httpResponseApi';
import { createTranslateLoader } from 'src/app/modules/prime.module';
import { Base64 } from 'src/app/utils/base64/base64';
import { DtUtils } from 'src/app/utils/data-table/dt-utils/dt-utils';
import { DtRequest } from 'src/app/utils/data-table/models/dt-request';
import { ApiName, EndpointName } from 'src/environments/environment';

import {
    HTTP_INTERCEPTORS, HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpResponse
} from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { CityService } from './city.service';

describe('CityService', () => {
    let service: CityService;
    let controller: HttpTestingController;
    let client: HttpClient;
    let dtUtils: DtUtils<CityModel, CityFilter>;
    let translateService: TranslateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                TranslateModule.forRoot({ loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
                RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', useHash: false }),
            ],
            providers: [
                CityService,
                TranslateService,
                { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
            ]
        });

        client = TestBed.inject(HttpClient);
        translateService = TestBed.inject(TranslateService);
        dtUtils = new DtUtils<CityModel, CityFilter>(translateService, 'cityId',EndpointName.City)

        controller = TestBed.inject(HttpTestingController);
        service = TestBed.inject(CityService);

        spyOn(Base64, 'toFile').and.callFake(()=>{
            return ;
          });
    });


    it('getAll - OK', () => {
        const _dataMock = <CityModel[]>[
            {
                cityId: 1,
                code: "Test",
                abbreviation: "Test",
                name: "Test",
                stateId: 1,
                countryId: 1,
                enabled: true
            }
        ];

        let _filterMock: CityFilter = <CityFilter>{
            cityId: null,
            code: "",
            abbreviation: "",
            name: "",

            stateId: 1,
            countryId: 1,
            enabled: ''
        };

        service.getAll(_filterMock)
            .subscribe({
                next(_httpResponse: HttpResponse<HttpResponseApi<CityModel[] | null>>) {
                    expect(_httpResponse).toBeTruthy();
                    expect(_httpResponse.status).toEqual(200);
                    expect(_httpResponse.body).not.toBeNull();
                    expect(_httpResponse.body?.code).toEqual(200);
                    expect(_httpResponse.body?.data).toEqual(_dataMock);
                },
            });



        let _requestDt: DtRequest | any = new DtRequest();
        _requestDt = dtUtils.wrapRequestWithFilters(null);
        _requestDt.fields = 'cityId,name';
        _requestDt.sortField = 'name';
        _requestDt.allowPaging = false;

        if (_filterMock != null) {
            for (let key in _filterMock) {
                let value = (<any>_filterMock)[key];
                _requestDt[key] = value;
            }
        }

      

        const _urlMock: string = `${ApiName.Default}${EndpointName.City}`;

        let _params: HttpParams = new HttpParams().appendAll(<any>_requestDt);
        let httpReq: HttpRequest<any> = new HttpRequest('GET', _urlMock, { params: _params, observe: 'response' });
        let requestMock = controller.expectOne((req: HttpRequest<any>) => {
           
            return req.method === httpReq.method && req.urlWithParams === httpReq.urlWithParams
        }
        );

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
        const _dataMock = <CityModel[]>[
            {
                cityId: 1,
                code: "Test",
                abbreviation: "Test",
                name: "Test",
                stateId: 1,
                countryId: 1,
                enabled: true
            }
        ];

        let _filterMock: CityFilter = <CityFilter>{
            cityId: null,
            code: "",
            abbreviation: "",
            name: "",

            stateId: 1,
            countryId: 1,
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
        _requestDt.fields = 'cityId,name';
        _requestDt.sortField = 'name';
        _requestDt.allowPaging = false;

        if (_filterMock != null) {
            for (let key in _filterMock) {
                let value = (<any>_filterMock)[key];
                _requestDt[key] = value;
            }
        }

        const _urlMock: string = `${ApiName.Default}${EndpointName.City}`;

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