import { Observable } from 'rxjs';
import { ApiName, EndpointName, environment as env } from 'src/environment';

import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HttpResponseApi } from '../../models/httpResponseApi';
import { DtRequest } from 'src/app/utils/data-table/models/dt-request';

/**
 * servicio base para realizar llamadas baseHttp
 * Cuando hay error siempre regresa el mismo objeto:
 * @return {code: 503, data: null, message: ''}
 */
@Injectable()
export class BaseApiService {
    constructor(public baseHttp: HttpClient) {

    }

    get<T>(apiName: ApiName, endpointName: string, params: DtRequest | null): Observable<HttpResponse<HttpResponseApi<T | null>>> {
        let _httpParams = new HttpParams()
        if (params != null) {
            _httpParams = new HttpParams().appendAll(<any>params);
        }
        return this.baseHttp.get<HttpResponseApi<T>>(env.getUlrApi(apiName, endpointName), { params: _httpParams, observe: 'response' });
    }

    post<T>(apiName: ApiName, endpointName: EndpointName, input: T): Observable<HttpResponse<HttpResponseApi<T>>> {
        let resp = this.baseHttp.post<HttpResponse<HttpResponseApi<T>>>(env.getUlrApi(apiName, endpointName), input);
        return resp;
    }

    patch<T>(apiName: ApiName, endpointName: string, input: T): Observable<HttpResponse<HttpResponseApi<any>>> {
        return this.baseHttp.patch<HttpResponse<HttpResponseApi<any>>>(env.getUlrApi(apiName, endpointName), input);
    }

    put<T>(apiName: ApiName, endpointName: string, input: T): Observable<HttpResponse<HttpResponseApi<any>>> {
        return this.baseHttp.put<HttpResponse<HttpResponseApi<any>>>(env.getUlrApi(apiName, endpointName), input);
    }

    delete(apiName: ApiName, endpointName: string): Observable<HttpResponse<HttpResponseApi<any>>> {
        return this.baseHttp.delete<HttpResponse<HttpResponseApi<any>>>(env.getUlrApi(apiName, endpointName));
    }


}

