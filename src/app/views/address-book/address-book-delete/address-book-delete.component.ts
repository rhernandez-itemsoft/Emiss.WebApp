import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddressBookFilter, AddressBookModel } from 'src/app/models/address-book-model';
import { AddressBookService } from 'src/app/services/address-book/address-book.service';
import { DtUtils } from 'src/app/utils/data-table/dt-utils/dt-utils';
import { ApiName, EndpointName } from 'src/environment';

@Component({
  selector: 'app-address-book-delete',
  templateUrl: './address-book-delete.component.html',
  styleUrls: ['./address-book-delete.component.scss']
})
export class AddressBookDeleteComponent extends DtUtils<AddressBookModel, AddressBookFilter>{
  //Bandera que sirve para saber que se está haciendo una peticion al back-end
  doingRequest: boolean = false;

  //the addressBookId
  data: AddressBookModel | null = null;;

  //El constructor
  constructor(
    private addressBookervice: AddressBookService,
    private msg: MessageService,
    private dialogConfig: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    super('addressBookId', EndpointName.AddressBook);
    this.loadData();
  }


  //Inicializa cuando se muestra la pantalla
  loadData(): void {
    this.data = this.dialogConfig.data;
  }

  // Envia los datos al back-end para que sean almacenados
  delete(): void {
    if (!this.validateBeforeDelete()) {
      return;
    }


    this.doingRequest = true;
    let addressBookId: number = (<AddressBookModel>this.data).addressBookId;
    this.addressBookervice.delete(ApiName.Default, `${EndpointName.AddressBook}/${addressBookId}`)
      .subscribe({
        next: (response: any) => {
          this.doingRequest = false;
          this.msg.add({ severity: 'success', summary: "Ok", detail: "La dirección ha sido eliminada", });
          this.ref.close(response.data);
        },
        error: (err: HttpErrorResponse) => {
          this.doingRequest = false;
          const _msg = (err.error != null ? err.error.message : err.message || err.statusText);
          const _severity = err.status == 404 ? 'info' : 'error';
          this.msg.add({ severity: _severity, summary: 'Error.-', detail: _msg });
        }
      });
  }

  //ejecuta acciones antes de guardar como validaciones, formateos, etc
  private validateBeforeDelete(): boolean {
    if (this.data == null || (<AddressBookModel>this.data).addressBookId < 1) {
      this.msg.add({ severity: 'error', summary: 'Error.-', detail: 'Debe seleccionar el registro que desea eliminar' });
      return false;
    }

    return true;
  }

  //close this dialog
  close() {
    this.doingRequest = false;
    this.ref.close(null);
  }
}
