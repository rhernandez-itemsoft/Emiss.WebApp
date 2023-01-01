import { TreeNode } from 'primeng/api';
import { HttpResponseApi } from 'src/app/models/httpResponseApi';

import { HttpResponse } from '@angular/common/http';

import { DtRequest } from '../models/dt-request';
import { DtResponse } from '../models/dt-response';

export class DtUtils<T, U> {
    constructor(
        public primaryKey: string = '',

        //Nombre del endpoint principal
        public endpointName: string,

    ) {
    }

    //Almacena los parametros del request para trabajar con el datatable
    newRequestDt: DtRequest | any = new DtRequest();

    //contiene la respuesta en el formato que se necesita para trabajar con el DataTable
    responseDt: DtResponse<T[]> = new DtResponse<T[]>();

    //Contiene la fila seleccionada
    selectedRow: T | null = null;
    ///este si funcionaba
    // <T>{};

    //Cuando navegamos en la ventana "Details" y tenemos un registro seleccionado necesitamos ir avanzando  fila por fila
    //esto nos permite saber que fila es la seleccionada
    defaultSelected: number = -1;

    //variable para almacenar el filtro de cada modulo
    customFilter: U = <U>{};


    //regresa una respuesta vacia valida para el dataTable
    emptyResonse<T>(): DtResponse<T> { //any{

        return new DtResponse<T>();
    }

    //Returns the response to the format necessary to process the DataTable
    wrapPaginateResponse<T>(httpResponse: HttpResponse<HttpResponseApi<T>>): DtResponse<T> {
        let jsonResponse: DtResponse<T> = this.emptyResonse<T>();
        if (httpResponse.status > 199 && httpResponse.status < 300) {

            let paginationString = httpResponse.headers.get('X-Pagination');

            if (paginationString != null) {
                jsonResponse = <DtResponse<T>>JSON.parse(paginationString ?? 'null');
                if (httpResponse != null && httpResponse.body != null && httpResponse!.body!.code == 200 && httpResponse.body.data != null) {


                    jsonResponse.data = httpResponse.body.data;
                } else {
                    jsonResponse.data = [] as unknown as T;
                }
                let filtered = jsonResponse.recordsFiltered;
                jsonResponse.recordsFiltered = jsonResponse.recordsTotal;
                jsonResponse.recordsTotal = filtered;
            }

        }
        return jsonResponse;
    }

    //Returns the request to the format necessary to process the DataTable with filters added
    wrapRequestWithFilters(_dtRequest: DtRequest | null): DtRequest | any {

        for (let key in this.customFilter) {
            let value = this.customFilter[key];
            let isId = key.substring(key.length - 2, key.length).toUpperCase() == 'ID';

            if (typeof value == 'object' && value == null && isId) {
                continue;
            } else if (typeof value == 'boolean' && value == null) {
                continue;
            }
            (<any>this.newRequestDt)[key] = this.customFilter[key];
        }


        if (_dtRequest != null) {
            this.newRequestDt.first = _dtRequest.first == null ? 0 : _dtRequest.first;
            this.newRequestDt.rows = _dtRequest.rows == null || _dtRequest.rows == 0 ? (this.newRequestDt.rows == null || this.newRequestDt.rows == 0 ? 10 : this.newRequestDt.rows) : _dtRequest.rows;
            this.newRequestDt.sortField = _dtRequest.sortField == undefined || _dtRequest.sortField == null ? this.newRequestDt.sortField : _dtRequest.sortField;
            this.newRequestDt.sortOrder = _dtRequest.sortOrder == undefined || _dtRequest.sortOrder == null ? this.newRequestDt.sortOrder : _dtRequest.sortOrder;
        }

        return this.newRequestDt;
    }


    //Returns the response to the format necessary to process 
    wrapResponse<T>(httpResponse: HttpResponse<HttpResponseApi<T>>): HttpResponseApi<T> {
        let response: HttpResponseApi<T> = new HttpResponseApi();

        if (httpResponse.body != null) {
            response = httpResponse.body as HttpResponseApi<T>;
        }

        return response;
    }

    //generate new Key proposal
    newUUID(text: string): string {
        let uuid = '';
        // let text: string = event.target.value;
        if (text != '') {
            let arrText: string[] = text.replace('  ', ' ').split(' ');


            for (let sub of arrText) {
                if (sub.length == 3) {
                    uuid += ((uuid != '' ? '_' : '') + sub.substring(0, 3));
                } else if (sub.length > 3) {
                    uuid += ((uuid != '' ? '_' : '') + sub.substring(0, 3) + sub.substring(sub.length - 1, sub.length));
                } else {
                    uuid += ((uuid != '' ? '_' : '') + sub);
                }
                if (uuid.length >= 9) {
                    break;
                }
            }
        }

        const response = uuid.toUpperCase().substring(0, 10);

        return response;

    }

}