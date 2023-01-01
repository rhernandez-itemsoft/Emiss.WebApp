import { StateFilter, StateModel } from 'src/app/models/state-model';
import { DtUtils } from 'src/app/utils/data-table/dt-utils/dt-utils';
import { DtRequest } from 'src/app/utils/data-table/models/dt-request';
import { ApiName, EndpointName } from 'src/environment';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BaseApiService } from '../base-service/base-api.service';

@Injectable()
export class StateService extends BaseApiService {
    dtUtils!: DtUtils<StateModel, StateFilter>;

    constructor(
        @Inject(HttpClient) http: HttpClient,
    ) {
        super(http);
        this.dtUtils = new DtUtils<StateModel, StateFilter>('stateId', EndpointName.State);
    }


    /**
     * 
     * @returns Obtiene todos las ciudades que se encuentran es status "enabled"
     */
    public getAll(params: any) {
        let _requestDt: DtRequest | any = new DtRequest();
        _requestDt = this.dtUtils.wrapRequestWithFilters(null);
        _requestDt.fields = 'stateId,name';
        _requestDt.sortField = 'name';
        _requestDt.allowPaging = false;

        if (params != null) {
            for (let key in params) {
                let value = params[key];
                _requestDt[key] = value;
            }
        }

        return this.get<StateModel[]>(ApiName.Default, EndpointName.State, _requestDt);
    }
}

