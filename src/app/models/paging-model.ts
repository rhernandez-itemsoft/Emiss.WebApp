
export class PaginModel {
    pagingParameter: PagingParameter = new PagingParameter();
    entityFilter: any = {};
}

export class PagingParameter {
    first: number = 0;
    rows: number = 0;
    sortField: string = '';
    sortOrder: number = 1;
    exportFields: string = '';
    fields: string = '';
    allowPaging: boolean = true;
    fullResponse: boolean = false;
}