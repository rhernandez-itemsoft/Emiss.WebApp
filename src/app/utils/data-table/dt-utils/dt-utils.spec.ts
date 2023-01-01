
import { EndpointFilter, EndpointModel } from 'src/app/models/endpoint-model';
import { HttpResponseApi } from 'src/app/models/httpResponseApi';
import { createTranslateLoader } from 'src/app/modules/prime.module';
import { EndpointName } from 'src/environments/environment';

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { DtRequest } from '../models/dt-request';
import { DtResponse } from '../models/dt-response';
import { DtUtils } from './dt-utils';

describe('CallBackService', () => {

  let thisObj: DtUtils<EndpointModel, EndpointFilter>;
  let client: HttpClient;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed
      .configureTestingModule({

        imports: [
          HttpClientTestingModule,
          TranslateModule.forRoot({ loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
        ],
        providers: [
          TranslateService,
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

    client = TestBed.inject(HttpClient);
    translateService = TestBed.inject(TranslateService);
    thisObj = new DtUtils<EndpointModel, EndpointFilter>(translateService, 'endpointId',EndpointName.Endpoint);

  });



  it('emptyResonse', () => {
    let dataMock = new DtResponse<EndpointModel>();
    expect(thisObj).toBeTruthy();
    expect(thisObj.emptyResonse()).toBeInstanceOf(Object);
    expect(thisObj.emptyResonse()).toEqual(dataMock);
  });

  it('wrapPaginateResponse', () => {
    let responseMock = new DtResponse<EndpointModel>();

    let httpResponseMock = <HttpResponse<HttpResponseApi<EndpointModel>>>{
      status: 200,
      statusText: 'OK',
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      body: <HttpResponseApi<EndpointModel>>{
        code: 200,
        data: <EndpointModel>{},
        message: ""
      },
    };
    expect(thisObj).toBeTruthy();
    expect(thisObj.wrapPaginateResponse<EndpointModel>(httpResponseMock)).toBeInstanceOf(Object);
    expect(thisObj.wrapPaginateResponse<EndpointModel>(httpResponseMock)).toEqual(responseMock);
  });

  it('wrapRequestWithFilters', () => {

    thisObj.customFilter = <EndpointFilter>{
      endpointId: null,
      code: "",
      abbreviation: "",
      name: "",
      enabled: ''
    };

    let dtRequestMock: DtRequest | any = new DtRequest();
    for (let key in thisObj.customFilter) {
      let value = (<any>thisObj.customFilter)[key];
      let isId = key.substring(key.length - 2, key.length).toUpperCase() == 'ID';
      if (typeof value == 'object' && value == null && isId) {
        continue;
      } else if (typeof value == 'boolean' && value == null) {
        continue;
      }
      (<any>dtRequestMock)[key] = (<any>thisObj.customFilter)[key];
    }


    expect(thisObj).toBeTruthy();
    expect(thisObj.wrapRequestWithFilters(dtRequestMock)).toBeInstanceOf(Object);
    expect(thisObj.newRequestDt).toEqual(dtRequestMock);
  });

  it('wrapResponse', () => {
    let responseMock = <HttpResponseApi<EndpointModel>>{
      code: 200,
      data: <EndpointModel>{},
      message: ""
    };

    let httpResponseMock = <HttpResponse<HttpResponseApi<EndpointModel>>>{
      status: 200,
      statusText: 'OK',
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      body: <HttpResponseApi<EndpointModel>>{
        code: 200,
        data: <EndpointModel>{},
        message: ""
      },
    };
    expect(thisObj).toBeTruthy();
    expect(thisObj.wrapResponse<EndpointModel>(httpResponseMock)).toBeInstanceOf(Object);
    expect(thisObj.wrapResponse<EndpointModel>(httpResponseMock)).toEqual(responseMock);
  });

  it('newUUID', () => {
    let dataMock: string = 'this is a test for uuid';
    expect(thisObj).toBeTruthy();
    expect(thisObj.newUUID(dataMock)).toEqual('THIS_IS_A');
  });
});
