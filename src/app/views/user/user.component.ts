import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { UserModel, UserFilter } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user/user.service';
import { Base64 } from 'src/app/utils/base64/base64';
import { DataTable } from 'src/app/utils/data-table/datatable';
import { IDataTable } from 'src/app/utils/data-table/idatatable';
import { EndpointName, ApiName } from 'src/environment';
import { UserAddComponent } from './user-add/user-add.component';
import { UserDeleteComponent } from './user-delete/user-delete.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserFilterComponent } from './user-filter/user-filter.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent extends DataTable<UserModel, UserFilter> implements IDataTable {

  //The contructor
  constructor(
    public domSanitizer: DomSanitizer,
    private securityUserService: UserService,

    private msg: MessageService,
    public ref: DynamicDialogRef,
    public chRef: ChangeDetectorRef,
    @Inject(DialogService) dialogService: DialogService,

  ) {
    super(
      dialogService,

      UserAddComponent,

      UserEditComponent,

      UserDeleteComponent,

      UserFilterComponent,

      'userId',

      EndpointName.User

    );

    this.initialice();

  }

  //initialice this module
  private initialice() {
    // show breadcrumb
    this.setBreadcrumb();

    //init the form filters
    this.initFormFilters();

    //configure data table
    this.initDataTable();

    //init custom filters
    this.customFilter = <UserFilter>{
      groupId: null,
      enabled: true,
      userName: '',
      workEmail: '',
      firstName: '',
      lastName: '',
      mLastName: '',
    };

  }


  //inicializa el data table
  override initDataTable() {
    this.newRequestDt.fields = 'userId,userName,workEmail,firstName,lastName,mlastName,enabled,groupId,group,userDetail';
    this.newRequestDt.exportFields = 'userId,userName,workEmail,userDetail.firstName,userDetail.lastName,userDetail.mLastName,enabled,group.name';
    this.newRequestDt.sortField = 'firstName,lastName,mlastName';
  }

  //Obtiene los datos que se mostrarán en el DataTable
  override getData(event: any) {
    this.wrapRequestWithFilters(event);
    if (this.newRequestDt.group == null) {
      delete this.newRequestDt.group;
      delete this.newRequestDt.groupId;
    }

    this.securityUserService.get<UserModel[]>(ApiName.Default, `${EndpointName.User}`, this.newRequestDt)
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
          const _msg = (err.error != null ? err.error.message : err.message || err.statusText);
          const _severity = err.status == 404 ? 'info' : 'error';
          this.msg.add({ severity: _severity, summary: 'Error', detail: _msg });
        },
      });
  }



  //export to csv
  override exportToCsv() {

    super.exportToCsv();
    this.securityUserService.get(ApiName.Default, `${EndpointName.User}/ExportCsv`, this.newRequestDt)
      .subscribe({
        next: (response: any) => {

          //download report
          let data: string = response.body?.data;
          let fileName: string = '/user_report' + formatDate(new Date(), 'yyyy-MM-dd', 'en');
          Base64.toFile(data, 'csv', fileName);
          return;
        },
        error: (err: HttpErrorResponse) => {
          const _msg = (err.error != null ? err.error.message : err.message || err.statusText);
          const _severity = err.status == 404 ? 'info' : 'error';
          this.msg.add({ severity: _severity, summary: 'Error', detail: _msg });
        },
      });
  }

  //export to xls
  override exportToXls() {

    super.exportToXls();
    this.securityUserService.get(ApiName.Default, `${EndpointName.User}/ExportXls`, this.newRequestDt)
      .subscribe({
        next: (response: any) => {

          //download report
          let data: string = response.body?.data;
          let fileName: string = '/user_report' + formatDate(new Date(), 'yyyy-MM-dd', 'en');
          Base64.toFile(data, 'xls', fileName);
          return;
        },
        error: (err: HttpErrorResponse) => {
          const _msg = (err.error != null ? err.error.message : err.message || err.statusText);
          const _severity = err.status == 404 ? 'info' : 'error';
          this.msg.add({ severity: _severity, summary: 'Error', detail: _msg });
        },
      });

  }

  //export to pdf
  override exportToPdf() {

    super.exportToPdf();
    this.securityUserService.get(ApiName.Default, `${EndpointName.User}/ExportPdf`, this.newRequestDt)
      .subscribe({
        next: (response: any) => {

          //download report
          let data: string = response.body?.data;
          let fileName: string = '/user_report' + formatDate(new Date(), 'yyyy-MM-dd', 'en');
          Base64.toFile(data, 'pdf', fileName);
          return;
        },
        error: (err: HttpErrorResponse) => {
          const _msg = (err.error != null ? err.error.message : err.message || err.statusText);
          const _severity = err.status == 404 ? 'info' : 'error';
          this.msg.add({ severity: _severity, summary: 'Error', detail: _msg });
        },
      });

  }

  //show dialog - new user
  override showDialogAdd(): DynamicDialogRef {
    this.dialogTitles.new = 'Agregar';
    return super.showDialogAdd({ width: '80rem' });
  }

  //show dialog - edit user
  override showDialogEdit(): DynamicDialogRef | null {
    if (this.selectedRow == null) {
      return null;
    }
    this.dialogTitles.edit = 'Editar: ' + `${this.selectedRow.firstName} ${this.selectedRow.lastName} ${this.selectedRow.mLastName}` ;
    return super.showDialogEdit({ width: '80rem' });
  }

  //show dialog - delete user
  override showDialogDelete(): DynamicDialogRef | null {
    if (this.selectedRow == null) {
      return null;
    }
    this.dialogTitles.delete = 'Eliminar: ' + `${this.selectedRow.firstName} ${this.selectedRow.lastName} ${this.selectedRow.mLastName}` ;
    return super.showDialogDelete({ width: '40rem', data: this.selectedRow });
  }

  //show dialog filter users
  override showDialogFilter(): DynamicDialogRef {

    this.dialogTitles.filter = 'Filtrar';
    return super.showDialogFilter({ width: '80rem' });
  }

}

