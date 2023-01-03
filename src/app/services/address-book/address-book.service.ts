import { AddressBookFilter, AddressBookModel } from 'src/app/models/address-book-model';
import { DtUtils } from 'src/app/utils/data-table/dt-utils/dt-utils';
import {  EndpointName } from 'src/environment';

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BaseApiService } from '../base-service/base-api.service';


@Injectable({
    providedIn: 'root',
})
export class AddressBookService extends BaseApiService {
    dtUtils!: DtUtils<AddressBookModel, AddressBookFilter>;

    constructor(
        @Inject(HttpClient) http: HttpClient,
    ) {
        super(http);
        this.dtUtils = new DtUtils<AddressBookModel, AddressBookFilter>('addressBookId', EndpointName.AddressBook);
    }

}
