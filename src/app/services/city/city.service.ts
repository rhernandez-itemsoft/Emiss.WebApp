import { Observable } from 'rxjs';
import { CityFilter, CityModel } from 'src/app/models/city-model';
import { HttpResponseApi } from 'src/app/models/httpResponseApi';
import { DtUtils } from 'src/app/utils/data-table/dt-utils/dt-utils';
import { DtRequest } from 'src/app/utils/data-table/models/dt-request';
import { ApiName, EndpointName } from 'src/environment';

import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BaseApiService } from '../base-service/base-api.service';


@Injectable()
export class CityService extends BaseApiService {
    dtUtils!: DtUtils<CityModel, CityFilter>;

    constructor(
        @Inject(HttpClient) http: HttpClient,
    ) {
        super(http);
        this.dtUtils = new DtUtils<CityModel, CityFilter>('cityId',EndpointName.City);
    }

    /**
     * 
     * @returns Obtiene todos las ciudades
     */
    public getAll( params: CityFilter):Observable<HttpResponse<HttpResponseApi<CityModel[] | null>>> {
        let _requestDt: DtRequest | any = new DtRequest();
        _requestDt = this.dtUtils.wrapRequestWithFilters(null);
        _requestDt.fields = 'cityId,name';
        _requestDt.sortField = 'name';
        _requestDt.allowPaging = false;
      

        if (params != null) {
            for (let key in params) {
                let value = (<any>params)[key];
                _requestDt[key] = value;
            }
        }

      
        
        let response = this.get<CityModel[]>(ApiName.Default, EndpointName.City,  _requestDt);
        
        return response;
    }
}

