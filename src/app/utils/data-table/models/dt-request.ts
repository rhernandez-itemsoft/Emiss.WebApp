import { DtSortOrder } from './dt-sort-order';

// Request from DataTable
export class DtRequest {
    draw: number = 0;

    PageSize: number = 10;
    first: number = 0;
    rows: number = 10;

    sortField: string = '';
    sortOrder: DtSortOrder = DtSortOrder.Asc;

    exportFields: string = '';
    fields: string = '';

    allowPaging: Boolean = true;
    fullResponse: boolean = false;

}

