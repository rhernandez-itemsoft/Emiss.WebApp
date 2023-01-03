import { CountryFilter, CountryModel } from 'src/app/models/country-model';
import { DtUtils } from 'src/app/utils/data-table/dt-utils/dt-utils';
import { DtRequest } from 'src/app/utils/data-table/models/dt-request';
import { ApiName, EndpointName } from 'src/environment';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BaseApiService } from '../base-service/base-api.service';


@Injectable()
export class CountryService extends BaseApiService {
    dtUtils!: DtUtils<CountryModel, CountryFilter>;

    constructor(
        @Inject(HttpClient) http: HttpClient,
    ) {
        super(http);
        this.dtUtils = new DtUtils<CountryModel, CountryFilter>( 'countryId',EndpointName.Country);
    }

    /**
     * 
     * @returns Obtiene todos los paises
     */
    public getAll( params: CountryFilter) {
        let _requestDt: DtRequest | any = new DtRequest();
        _requestDt = this.dtUtils.wrapRequestWithFilters(null);
        _requestDt.fields = 'countryId,name';
        _requestDt.sortField = 'name';
        _requestDt.allowPaging = false;
       

        if (params != null) {
            for (let key in params) {
                let value = (<any>params)[key];
                _requestDt[key] = value;
            }
        }
        
        return this.get<CountryModel[]>(ApiName.Default, EndpointName.Country,  _requestDt);
    }

}

