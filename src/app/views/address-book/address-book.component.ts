import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { AddressBookModel, AddressBookFilter } from 'src/app/models/address-book-model';
import { AddressBookService } from 'src/app/services/address-book/address-book.service';

import { Base64 } from 'src/app/utils/base64/base64';
import { DataTable } from 'src/app/utils/data-table/datatable';
import { IDataTable } from 'src/app/utils/data-table/idatatable';
import { EndpointName, ApiName } from 'src/environment';
import { AddressBookAddComponent } from './address-book-add/address-book-add.component';
import { AddressBookDeleteComponent } from './address-book-delete/address-book-delete.component';
import { AddressBookEditComponent } from './address-book-edit/address-book-edit.component';
import { AddressBookFilterComponent } from './address-book-filter/address-book-filter.component';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.scss']
})
export class AddressBookComponent extends DataTable<AddressBookModel, AddressBookFilter> implements IDataTable {

  //The contructor
  constructor(
    public domSanitizer: DomSanitizer,
    private addressBookervice: AddressBookService,
    private msg: MessageService,
    public ref: DynamicDialogRef,
    public chRef: ChangeDetectorRef,
    @Inject(DialogService) dialogService: DialogService,

  ) {
    super(
      dialogService,

      AddressBookAddComponent,

      AddressBookEditComponent,

      AddressBookDeleteComponent,

      AddressBookFilterComponent,

      'addressBookId',

      EndpointName.AddressBook

    );

    this.initialice();

  }

  //initialice this module
  private initialice() {
    // show breadcrumb
    this.setBreadcrumb();

    //init context menu
    this.initContextMenu();

    //init the form filters
    this.initFormFilters();

    //configure data table
    this.initDataTable();

    //init custom filters
    this.customFilter = <AddressBookFilter>{
      // addressBookId: null,
      address: '',
      fullName: '',
      phone: '',
      email: '',
      enabled: true,
      alias: ''
    };

  }

  //inicializa el data table
  override initDataTable() {
    this.newRequestDt.fields = 'addressBookId,alias,phone,email,countryId,stateId,cityId,street,subdivision,reference,zipCode,enabled,user,country,city,state';
    this.newRequestDt.exportFields = 'addressBookId,alias,user.fullName';
    this.newRequestDt.sortField = 'alias';
  }

  //Obtiene los datos que se mostrarán en el DataTable
  override getData(event: any) {
    this.wrapRequestWithFilters(event);
    if (this.newRequestDt.group == null) {
      delete this.newRequestDt.group;
      delete this.newRequestDt.groupId;
    }

    this.addressBookervice.get<AddressBookModel[]>(ApiName.Default, `${EndpointName.AddressBook}`, this.newRequestDt)
      .subscribe({
        next: (response: any) => {
          this.responseDt = this.wrapPaginateResponse(response);
          if (this.defaultSelected > -1 && this.responseDt.data != null) {
            this.selectedRow = this.responseDt.data[this.defaultSelected];
            this.defaultSelected = -1;
          }
        },
        error: (err: HttpErrorResponse) => {
          this.responseDt = this.emptyResonse();

          if (err.status != 404) {
            const _msg = (err.error != null && err.error.message ? err.error.message : err.message || err.statusText);
            const _severity = err.status == 404 ? 'info' : 'error';

            this.msg.add({ severity: _severity, summary: 'Error', detail: _msg });
          }
        },
      });
  }

  //export to csv
  override exportToCsv() {

    super.exportToCsv();
    this.addressBookervice.get(ApiName.Default, `${EndpointName.AddressBook}/ExportCsv`, this.newRequestDt)
      .subscribe({
        next: (response: any) => {

          //download report
          let data: string = response.body?.data;
          let fileName: string = '/addressBook_report' + formatDate(new Date(), 'yyyy-MM-dd', 'en');
          Base64.toFile(data, 'csv', fileName);
          return;
        },
        error: (err: HttpErrorResponse) => {
          const _msg = (err.error != null && err.error.message ? err.error.message : err.message || err.statusText);
          const _severity = err.status == 404 ? 'info' : 'error';
          this.msg.add({ severity: _severity, summary: 'Error', detail: _msg });
        },
      });
  }

  //export to xls
  override exportToXls() {

    super.exportToXls();
    this.addressBookervice.get(ApiName.Default, `${EndpointName.AddressBook}/ExportXls`, this.newRequestDt)
      .subscribe({
        next: (response: any) => {

          //download report
          let data: string = response.body?.data;
          let fileName: string = '/addressBook_report' + formatDate(new Date(), 'yyyy-MM-dd', 'en');
          Base64.toFile(data, 'xls', fileName);
          return;
        },
        error: (err: HttpErrorResponse) => {
          const _msg = (err.error != null && err.error.message ? err.error.message : err.message || err.statusText);
          const _severity = err.status == 404 ? 'info' : 'error';
          this.msg.add({ severity: _severity, summary: 'Error', detail: _msg });
        },
      });

  }

  //export to pdf
  override exportToPdf() {

    super.exportToPdf();
    this.addressBookervice.get(ApiName.Default, `${EndpointName.AddressBook}/ExportPdf`, this.newRequestDt)
      .subscribe({
        next: (response: any) => {

          //download report
          let data: string = response.body?.data;
          let fileName: string = '/addressBook_report' + formatDate(new Date(), 'yyyy-MM-dd', 'en');
          Base64.toFile(data, 'pdf', fileName);
          return;
        },
        error: (err: HttpErrorResponse) => {
          const _msg = (err.error != null && err.error.message ? err.error.message : err.message || err.statusText);
          const _severity = err.status == 404 ? 'info' : 'error';
          this.msg.add({ severity: _severity, summary: 'Error', detail: _msg });
        },
      });

  }

  //show dialog - new addressBook
  override showDialogAdd(): DynamicDialogRef {
    this.dialogTitles.new = 'Agregar';
    return super.showDialogAdd({ width: '80rem' });
  }

  //show dialog - edit addressBook
  override showDialogEdit(): DynamicDialogRef | null {
    if (this.selectedRow == null) {
      return null;
    }
    this.dialogTitles.edit = 'Editar: ' + `${this.selectedRow.alias}`;
    return super.showDialogEdit({ width: '80rem' });
  }

  //show dialog - delete addressBook
  override showDialogDelete(): DynamicDialogRef | null {
    if (this.selectedRow == null) {
      return null;
    }
    this.dialogTitles.delete = 'Eliminar: ' + `${this.selectedRow.alias}`;
    return super.showDialogDelete({ width: '40rem', data: this.selectedRow });
  }

  //show dialog filter addressBooks
  override showDialogFilter(): DynamicDialogRef {
    this.dialogTitles.filter = 'Filtrar';
    return super.showDialogFilter({ width: '80rem' });
  }

  //Search by alias when enter key press
  onEnterSearchAlias($event: any) {
    if ($event.keyCode == 13) {
      this.getData(null);
    }
  }



}

