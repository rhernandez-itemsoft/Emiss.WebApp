import { MenuItem } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Paginator } from 'primeng/paginator';

import { Directive, Inject, Type, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DtUtils } from './dt-utils/dt-utils';
import { DialogTitles } from './models/dialog-titles';

@Directive({
    providers: [],
})
export class DataTable<T, U> extends DtUtils<T, U> {

    //the constructor
    constructor(
        public dialogService: DialogService,

        // reference to addComponent
        protected addComponent: Type<any>,

        //reference to editComponent
        protected editComponent: Type<any>,

        //reference to deleteComponent
        protected deleteComponent: Type<any>,

        //reference to filterComponent
        protected filterComponent: Type<any>,

        //llave primaría de la tabla, sirve para la vista de detalle
        primaryKey: string,

        //Nombre del endpoint principal
        endpointName: string,

    ) {
        super(primaryKey, endpointName);

    }


    //Dialog titles for context menu from DataTable
    dialogTitles: DialogTitles = <DialogTitles>{
        new: 'New',
        edit: 'Edit',
        delete: 'Delete',
        filter: 'Filter',
        detail: 'Full View',
    };

    // customFilter!: U;
    globalFilter: string = '';

    //formulario de la sección de busqueda
    formFilter: FormGroup = <FormGroup>{};

    //Bandera para que permite mostrar u oculatar las ventanas de dialogo de Agregar, Editar, Eliminar, Detalle
    displayDetail: boolean = false;

    //contiene la estructura del menú contextual que se despliega en el data table
    dtMenuItem: MenuItem[] = <MenuItem[]>[];

    //contiene la estructura del menú contextual que se despliega para exportar
    dtMenuExportItem: MenuItem[] = <MenuItem[]>[];

    //hace referencia al paginador
    @ViewChild('paginator', { static: true }) paginator!: Paginator;

    //dataTable - context menu
    @ViewChild('dtCtxMenu', { static: true }) dtCtxMenu!: ContextMenu;

    //Export - context menu
    @ViewChild('dtCtxMenuExport', { static: true }) dtCtxMenuExport!: ContextMenu;

    //inicializa el menú contextual que se despliga en el data table
    initContextMenu(): void {
        this.dtMenuItem = [
            { label: 'Detalle', icon: 'pi pi-fw pi-search', command: () => { this.displayDetail = true; } },
        ];

        this.dtMenuItem.push({ label: 'Editar', icon: 'fa pi-fw pi pi-pencil', command: () => this.showDialogEdit() });


        this.dtMenuItem.push({ label: 'Eliminar', icon: 'pi pi-fw pi-trash', command: () => this.showDialogDelete() });


        this.dtMenuExportItem = [
            { label: 'Csv', icon: 'pi pi-file', command: () => this.exportToCsv() },
            { label: 'Excel', icon: 'pi pi-file-excel', command: () => this.exportToXls() },
            { label: 'Pdf', icon: 'pi pi-file-pdf', command: () => this.exportToPdf() },
        ];
    }

    //show dialog add new row
    showDialogAdd(conf: DynamicDialogConfig | null = null): DynamicDialogRef {
        let _conf = Object.assign({},
            {
                header: this.dialogTitles.new,
                width: '70%'
            }, conf);


        const ref = this.dialogService.open(this.addComponent, _conf);
        ref.onClose.subscribe((item: T) => this.onCloseAddDialog(item));
        return ref;
    }

    //show dialog edit row
    showDialogEdit(conf: DynamicDialogConfig | null = null): DynamicDialogRef | null {

        if (this.selectedRow != null) {
            let _conf = Object.assign({},
                {
                    header: this.dialogTitles.edit,
                    width: '70%',
                    data: this.selectedRow
                }, conf);
            const ref = this.dialogService.open(this.editComponent, _conf);

            ref.onClose.subscribe((item: T) => this.onCloseEditDialog(item));
            return ref;
        }
        return null;
    }

    //show dialog delete row
    showDialogDelete(conf: DynamicDialogConfig | null = null): DynamicDialogRef | null {
        if (this.selectedRow != null) {
            let _conf = Object.assign({},
                {
                    header: this.dialogTitles.delete,
                    width: '70%',
                }, conf);
            const ref = this.dialogService.open(this.deleteComponent, _conf);

            ref.onClose.subscribe((item: T) => this.onCloseDeleteDialog(item));
            return ref;
        }
        return null;
    }

    //show dialog filter row
    showDialogFilter(conf: DynamicDialogConfig | null = null): DynamicDialogRef {
        let _conf = Object.assign({},
            {
                header: this.dialogTitles.filter,
                width: '70%',
                data: this.customFilter
            }, conf);

        const ref = this.dialogService.open(this.filterComponent, _conf);

        ref.onClose.subscribe((item: any) => {
            this.onCloseFilterDialog(item)
        });
        return ref;
    }

    //on close add dialog
    onCloseAddDialog(item: T): void {
        if (item) {
            this.getData(null);
        }
    }

    //on close edit dialog
    onCloseEditDialog(item: T | null): void {
        if (item) {
            this.getData(null);
        }
    }

    //on close delete dialog
    onCloseDeleteDialog(item: T | null): void {
        if (item) {
            this.getData(null);
        }
    }

    //on close filter dialog
    onCloseFilterDialog(item: U | null): void {
        if (item) {
            this.customFilter = item;
            this.getData(null);
        }
    }

    //export to csv
    exportToCsv(): void {
        this.newRequestDt.allowPaging = false;
        this.wrapRequestWithFilters(null);
    }

    //export to xls
    exportToXls(): void {
        this.newRequestDt.allowPaging = false;
        this.wrapRequestWithFilters(null);
    }

    //export to pdf
    exportToPdf(): void {
        this.newRequestDt.allowPaging = false;
        this.wrapRequestWithFilters(null);
    }

    //funcion fantasma para refrescar los datos del data table
    getData(_: any): void { }

    //Accion para resfrescar los datos del data table
    refreshData(): void {
        this.getData(null);
    }

    //close detail
    closeDialogDetail(_: any) {
        this.displayDetail = false;
    }

    //retrocede una posición la fila seleccionada
    goBackRow(): void {

        let selectedIndex = 0;
        if (this.responseDt.data == null || this.responseDt.data.length < 1) {
            this.selectedRow = null; // <T>{};
            return;
        }

        let _page: number = this.responseDt.page;
        let _length: number = this.responseDt.length;
        if (this.selectedRow != null && this.selectedRow != null) {

            selectedIndex = this.responseDt.data.findIndex((row: any) => row[this.primaryKey] == (<any>this.selectedRow)[this.primaryKey]);

            if (selectedIndex > 0) {
                selectedIndex--;
            } else if (_page > 1) {
                this.defaultSelected = _length - 1;
                // cambiamos esto porque estába haciendo un salto de dos páginas
                // 11-03-2022
                // this.paginator.changePage(_page - 2);
                this.paginator.changePage(_page - 2);
                return;
            }
        }

        this.selectedRow = this.responseDt.data[selectedIndex];

    }

    //avanza una posición la fila seleccionada
    goNextRow(): void {
        let selectedIndex = 0;

        if (this.responseDt.data == null || this.responseDt.data.length < 1) {
            this.selectedRow = null; // <T>{};
            return;
        }


        let _page: number = this.responseDt.page;
        let _pages: number = this.responseDt.pages;
        let lengthData: number = this.responseDt.data.length - 1;
        if (this.selectedRow != null && this.selectedRow != null) {
            selectedIndex = this.responseDt.data.findIndex((row: any) => row[this.primaryKey] == (<any>this.selectedRow)[this.primaryKey]);

            if (selectedIndex < lengthData) {
                selectedIndex++;
            } else if (_page < _pages) {
                this.defaultSelected = 0;
                this.paginator.changePage(_page);
                return;
            }
        }
        this.selectedRow = this.responseDt.data[selectedIndex];
    }

    //show context menu data row
    showMenuContext(cm: ContextMenu, event: MouseEvent, row: any): void {
        this.dtCtxMenuExport.hide();

        this.selectedRow = row;
        cm.show(event);
        event.stopPropagation();
    }

    // show context menu export button
    showMenuContextExport(cm: ContextMenu, event: MouseEvent): void {
        this.dtCtxMenu.hide();
        cm.show(event);
        event.stopPropagation();
    }

    //hide context menu from export button
    hideExportMenuContext(): void {
        this.dtCtxMenuExport.hide();
    }

    //Establece el breadcrum  que se muestra para saber en que parte del sistema nos encontramos
    setBreadcrumb(): void { }

    //inicializá el formulario reactivo de la seccion de busqueda (filter)
    initFormFilters(): void { }

    //Limpia el formulario de busqueda
    clearFilter(): void { }

    //initialice the table
    initDataTable(): void { }


}


