import { UserFilter, UserModel } from 'src/app/models/user-model';
import { DtUtils } from 'src/app/utils/data-table/dt-utils/dt-utils';
import {  EndpointName } from 'src/environment';

import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BaseApiService } from '../base-service/base-api.service';


@Injectable({
    providedIn: 'root',
})
export class UserService extends BaseApiService {
    dtUtils!: DtUtils<UserModel, UserFilter>;

    constructor(
        @Inject(HttpClient) http: HttpClient,
    ) {
        super(http);
        this.dtUtils = new DtUtils<UserModel, UserFilter>('userId', EndpointName.User);
    }

}
