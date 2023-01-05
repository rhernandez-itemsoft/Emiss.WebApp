import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddressBookFilter, AddressBookModel } from 'src/app/models/address-book-model';
import { AddressBookService } from 'src/app/services/address-book/address-book.service';
import { DtUtils } from 'src/app/utils/data-table/dt-utils/dt-utils';
import { EndpointName } from 'src/environment';

@Component({
  selector: 'app-address-book-filter',
  templateUrl: './address-book-filter.component.html',
  styleUrls: ['./address-book-filter.component.scss']
})
export class AddressBookFilterComponent extends DtUtils<AddressBookModel, AddressBookFilter> {
  //los datos del registro que se esta trabajando
  data!: AddressBookFilter;

  //form filter
  formFilter: FormGroup = this._frmBuilder.group({
    // addressBookId: new FormControl(null),

    fullName: new FormControl(''),
    address: new FormControl(''),
    phone: new FormControl(''),
    email: new FormControl(''),

    enabled: new FormControl(true),
  });

  //Switch enabled
  allStatus: any = [
    { name: "Activo", value: true },
    { name: "Inactivo", value: false },
    { name: "Todos", value: 'null' },
  ];

  //The contructor
  constructor(
    private _frmBuilder: FormBuilder,
    public ref: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig,
  ) {
    super('addressBook', EndpointName.AddressBook);
    this.loadData();
  }


  //inicializá el formulario reactivo de la seccion de busqueda (filter)
  private loadData() {
    this.data = this.dialogConfig.data;
    if (this.data != undefined && this.data != null) {
      this.data.enabled = this.data.enabled === '' ? 'null' : this.data.enabled;

      this.formFilter = this._frmBuilder.group({
        fullName: new FormControl(this.data.fullName),
        address: new FormControl(this.data.address),
        phone: new FormControl(this.data.phone),
        email: new FormControl(this.data.email),
        enabled: new FormControl(this.data.enabled),

      });
    }
  }

  //get values filters and return this
  applyFilter() {
    let data: any = Object.assign({}, this.formFilter.value);
    data.enabled = data.enabled == 'null' ? '' : data.enabled;
    this.ref.close(data);
  }

  //close dialog component
  close() {
    this.ref.close(null);
  }

}