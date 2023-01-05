import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AddressBookModel, AddressBookFilter } from 'src/app/models/address-book-model';
import { CityModel, CityFilter } from 'src/app/models/city-model';
import { CountryModel, CountryFilter } from 'src/app/models/country-model';
import { StateModel, StateFilter } from 'src/app/models/state-model';
import { UserModel } from 'src/app/models/user-model';
import { AddressBookService } from 'src/app/services/address-book/address-book.service';
import { CallBackService } from 'src/app/services/callback/callback.service';
import { CityService } from 'src/app/services/city/city.service';
import { CountryService } from 'src/app/services/country/country.service';
import { ExternalService } from 'src/app/services/external/external.service';
import { StateService } from 'src/app/services/state/state.service';
import { DtUtils } from 'src/app/utils/data-table/dt-utils/dt-utils';
import { EndpointName, ApiName } from 'src/environment';
import { UserComponent } from '../../user/user.component';

@Component({
  selector: 'app-address-book-detail',
  templateUrl: './address-book-detail.component.html',
  styleUrls: ['./address-book-detail.component.scss']
})
export class AddressBookDetailComponent extends DtUtils<AddressBookModel, AddressBookFilter> implements OnInit {
  //Badera que sirve para saber que se debe de mostrar la ventana
  @Input() show: boolean = false;

  //Bandera que sirve para saber que se está haciendo una peticion al back-end
  doingRequest: boolean = false;

  //Notifica que se debe atrazar una posicion en los registros
  @Output() onGoBackRow = new EventEmitter<any>();

  //Notifica que se debe avanzar una posicion en los registros
  @Output() onGoNextRow = new EventEmitter<any>();

  //Notifica que se oculto la ventana
  @Output() onHide = new EventEmitter<boolean>();

  //notifica que se cerro la ventana
  @Output() onClose = new EventEmitter<any>();

  //la respuesta que se envia cuando se cierra la ventana
  response: any;

  allCountries: CountryModel[] = [];

  allStates: StateModel[] = [];

  allCities: CityModel[] = [];

  //los datos del registro que se esta trabajando
  @Input() data: AddressBookModel | null = null;

  //El formulario reactivo
  frmUser: FormGroup = this._frmBuilder.group({
    userId: new FormControl(null),
    firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    mLastName: new FormControl(''),
    enabled: new FormControl(true, [Validators.required, Validators.minLength(3)]),
  });

  //El formulario reactivo
  frmAddressBook: FormGroup = this._frmBuilder.group({
    alias: new FormControl('', [Validators.required, Validators.minLength(3)]),
    phone: new FormControl('', [Validators.required, Validators.minLength(10)]),
    email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]),


    countryId: new FormControl(0, [Validators.required]),
    country: new FormControl(null),
    stateId: new FormControl(0),
    state: new FormControl(null),
    cityId: new FormControl(0),
    city: new FormControl(null),

    street: new FormControl('', [Validators.required, Validators.minLength(3)]),
    subdivision: new FormControl(''),
    reference: new FormControl(''),
    zipCode: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });


  //El constructor
  constructor(
    private _frmBuilder: FormBuilder,
    private externalService: ExternalService,
    private msg: MessageService,
    private cd: ChangeDetectorRef,
    private _callBack: CallBackService,
    public ref: DynamicDialogRef,
    private dialogService: DialogService,
    private countryService: CountryService,
    private stateService: StateService,
    private cityService: CityService,
    private dialogConfig: DynamicDialogConfig,
    private addressBookService: AddressBookService,
  ) {
    super('addressBookId', EndpointName.AddressBook);
  }

  //Inicializa cuando se muestra la pantalla
  ngOnInit(): void {

  }

  //Detecta cuando ocurre uun cambio en @Input() data
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && changes['data'].currentValue) {
      this.data = changes['data'].currentValue;
      this.loadData();
    }
  }

  //Limpia el formulario preparandolo para agregar un registro nuevo
  loadData() {
    // this.data = this.dialogConfig.data;

    if (this.data != undefined && this.data != null) {
      console.log(this.data);

      this.frmUser.patchValue({
        userId: this.data.userId,
        firstName: this.data.user!.firstName,
        lastName: this.data.user!.lastName,
        mLastName: this.data.user!.mLastName,
        enabled: this.data.user!.enabled,
      });



      this.frmAddressBook.patchValue({
        enabled: this.data.enabled,
        userId: this.data.userId,

        alias: this.data.alias,
        email: this.data.email,
        phone: this.data.phone,


        countryId: this.data.countryId,
        stateId: this.data.stateId,
        cityId: this.data.cityId,

        country: this.data.country,
        state: this.data.state,
        city: this.data.city,


        zipCode: this.data.zipCode,

        street: this.data.street,
        subdivision: this.data.subdivision,
        reference: this.data.reference,
      });

      //get all countries
      this.getAllCountries(this.data.country?.name ?? '',
        this.getAllStates(this.data.state?.name ?? '',
          this.getAllCities(this.data.city?.name ?? '')
        )
      );

    } else {
      this.msg.add({ severity: 'error', summary: 'Error.-', detail: 'Debe seleccionar el registro que desea editar' });
      this.hide();
    }
  }


  //limpia e inicializa los formularios
  public clear() {
    this.frmUser.markAsUntouched();
    this.frmUser.markAsPristine();

    this.frmAddressBook.markAsUntouched();
    this.frmAddressBook.markAsPristine();
  }

  //filter state
  onFilterState(event: any) {
    this._callBack.execute(this, () => this.getAllStates(event.filter));
  }

  //filter city
  onFilterCity(event: any) {
    this._callBack.execute(this, () => this.getAllCities(event.filter));
  }

  //clear state dropdown
  onClearState(event: any) {
    this.frmAddressBook.patchValue({
      state: null,
      city: null,
    });
  }

  //clear city dropdown
  onClearCity(event: any) {
    this.frmAddressBook.patchValue({
      city: null,
    });
  }


  //Obtiene los paises que se pueden elegir
  private getAllCountries(text: string, callbackFunction?: Function | void) {
    let params = <CountryFilter>{
      name: text,
      enabled: true
    };
    this.countryService.getAll(params)
      .subscribe({
        next: (response: any) => {

          this.allCountries = <CountryModel[]>response.body.data;

          if (this.allCountries.length == 1) {
            let countryDefault: CountryModel = <CountryModel>this.allCountries[0];
            this.frmAddressBook.patchValue({
              country: countryDefault,
              countryId: countryDefault.countryId
            });

            if (callbackFunction) {
              callbackFunction.bind(this);
            }
          }
        },
        error: (err: HttpErrorResponse) => {
          if (err.status != 404) {
            this.allCountries = [];
            this.allStates = [];
            this.allCities = [];
            const _msg = (err.error != null && err.error.message ? err.error.message : err.message || err.statusText);
            const _severity = err.status == 404 ? 'info' : 'error';
            this.msg.add({ severity: _severity, summary: 'Error', detail: _msg });
          }
        }
      });
  }

  //Obtiene los estados que se pueden elegir en cada pais
  private getAllStates(text: string, callbackFunction?: Function | void) {
    let params = <StateFilter>{
      countryId: this.frmAddressBook.controls['country'].value.countryId,
      name: text,
      enabled: true
    };

    this.stateService.getAll(params)
      .subscribe({
        next: (response: any) => {
          this.allStates = <StateModel[]>response.body.data;

          if (this.allStates.length == 1) {

            let stateDefault: StateModel = <StateModel>this.allStates[0];
            this.frmAddressBook.patchValue({
              state: stateDefault,
              stateId: stateDefault.stateId
            });

            if (callbackFunction) {
              callbackFunction.bind(this);
            }
          }
        },
        error: (err: HttpErrorResponse) => {
          this.allStates = [];
          this.allCities = [];
          if (err.status != 404) {
            const _msg = (err.error != null && err.error.message ? err.error.message : err.message || err.statusText);
            const _severity = err.status == 404 ? 'info' : 'error';
            this.msg.add({ severity: _severity, summary: 'Error', detail: _msg });
          }
        }
      });
  }

  //Obtiene las ciudades que se pueden elegir en cada estado de cada pais
  private getAllCities(text: string) {
    let val = this.frmAddressBook.value;
    console.log(val);

    let _filter: CityFilter = <CityFilter>{
      countryId: this.frmAddressBook.controls['country'].value.countryId,
      stateId: this.frmAddressBook.controls['state'].value.stateId,
      name: text,
      enabled: true
    };

    this.cityService.getAll(_filter)
      .subscribe({
        next: (response: any) => {

          this.allCities = <CityModel[]>response.body.data;

          if (this.allCities.length == 1) {
            let cityDefault: CityModel = <CityModel>this.allCities[0];
            this.frmAddressBook.patchValue({
              city: cityDefault,
              cityId: cityDefault.cityId
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          this.allCities = [];
          if (err.status != 404) {
            const _msg = (err.error != null && err.error.message ? err.error.message : err.message || err.statusText);
            const _severity = err.status == 404 ? 'info' : 'error';
            this.msg.add({ severity: _severity, summary: 'Error', detail: _msg });
          }
        }
      });
  }

  //Envia una señal para retroceder una posicion en los registros
  goBackRow() {
    this.onGoBackRow.emit(true);
  }

  //Envia una señal para avanzar una posicion en los registros
  goNextRow() {
    this.onGoNextRow.emit(true);
  }

  //Envia la señal para ocultar la ventana
  hide() {
    this.onHide.emit(false);
  }

  //envia la señal para cerrar la ventana, con los datos que contenga "this.response"
  returnResponse() {
    this.onClose.emit(this.response);
  }

}
