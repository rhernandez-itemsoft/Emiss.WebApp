import { Paginator } from 'primeng/paginator/paginator';

export interface IDataTable {
    paginator: Paginator;

    initFormFilters():void;
    clearFilter():void;
    initDataTable():void;

    onCloseAddDialog(item: any):void;
    onCloseEditDialog(item: any):void;
    onCloseDeleteDialog(item: any):void;

    exportToCsv():void;
    exportToXls():void;
    exportToPdf():void;

    getData(dtEvent: any): void;
    goBackRow(): void;
    goNextRow(): void;
}