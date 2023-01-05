import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  selector: 'app-address-book-edit',
  templateUrl: './address-book-edit.component.html',
  styleUrls: ['./address-book-edit.component.scss']
})
export class AddressBookEditComponent extends DtUtils<AddressBookModel, AddressBookFilter> implements OnInit {
  //para saber cuand se realiza una llamada ajax
  doingRequest: boolean = false;

  allCountries: CountryModel[] = [];

  allStates: StateModel[] = [];

  allCities: CityModel[] = [];

  //los datos del registro que se esta trabajando
  data: AddressBookModel = new AddressBookModel();


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
    this.loadData();
  }


  //Limpia el formulario preparandolo para agregar un registro nuevo
  loadData() {
    this.data = this.dialogConfig.data;

    if (this.data != undefined && this.data != null) {

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
      this.close();
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

  //complete the address information
  completeAddress() {
    let addrBook: AddressBookModel = Object.assign({}, <AddressBookModel>this.frmAddressBook.value);
    let country: string = addrBook.country == null ? '' : addrBook.country.name;
    let zipCode: string = addrBook.country == null ? '' : addrBook.zipCode;


    this.externalService.getGoogleAddress(country, zipCode)
      .subscribe({
        next: (response: any) => {
          if (response.status == 200 && response.body.status == "OK") {
            let address = response.body.results[0].address_components;
            let state = address.find((item: any) => (<[]>item.types).find((typ: any) => typ == 'administrative_area_level_1')).long_name;
            let city = address.find((item: any) => (<[]>item.types).find((typ: any) => typ == 'locality')).long_name;


            //carga la información que predijo google
            this.getAllStates(state, this._callBack.execute(this, () => this.getAllCities(city)));
          }
        },
        error(error) {
        }
      });

  }

  //select user
  onSelectUser() {
    // this.dialogTitles.new = 'Agregar';
    // return super.showDialogAdd({ width: '80rem' });
    let _conf = {
      header: "Seleccione un usuario",
      width: '70%'
    };


    const ref = this.dialogService.open(UserComponent, _conf);
    ref.onClose.subscribe((response: any) => {
      if (response) {
        this.frmUser.patchValue({
          userId: response.userId,
          firstName: response.firstName,
          lastName: response.lastName,
          mLastName: response.mLastName,
        });

        this.frmAddressBook.patchValue({
          userId: response.userId,
        });
      }
    });
    return ref;
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

  // Envia los datos al back-end para que sean almacenados
  save() {
    let _input: AddressBookModel = this._wrapData();
    if (!this.validateBeforeSave()) {
      return;
    }

    this.doingRequest = true;
    this.addressBookService.put(ApiName.Default, EndpointName.AddressBook, _input)
      .subscribe({
        next: (response: any) => {
          this.doingRequest = false;

          this.msg.add({ severity: 'success', summary: 'Felicidades!', detail: 'La dirección ha sido actualizada.', });
          this.clear();
          this.ref.close(response.data);
        },
        error: (err: HttpErrorResponse) => {
          this.doingRequest = false;
          const _msg = (err.error != null && err.error.message ? err.error.message : err.message || err.statusText);
          const _severity = err.status == 404 ? 'info' : 'error';
          this.msg.add({ severity: _severity, summary: 'Error', detail: _msg });
        },
      });
  }

  //ejecuta acciones antes de guardar como validaciones, formateos, etc
  private validateBeforeSave(): boolean {
    return this.frmUser.valid && this.frmAddressBook.valid;
  }

  //obtiene los datos formateados para realizar la llamada al back-end
  public _wrapData(): AddressBookModel {
    let addrBook: AddressBookModel = Object.assign({}, <AddressBookModel>this.frmAddressBook.value);
    addrBook.countryId = addrBook.country == null ? null : addrBook.country.countryId;
    addrBook.stateId = addrBook.state == null ? null : addrBook.state.stateId;
    addrBook.cityId = addrBook.city == null ? null : addrBook.city.cityId;
    addrBook.country = null;
    addrBook.state = null;
    addrBook.city = null;

    let user: UserModel = Object.assign({}, <UserModel>this.frmUser.value);
    user.userId = user.userId ?? 0;
    if (user.userId < 1) {
      addrBook.user = user;
    }



    return addrBook;
  }

  //close this dialog
  close(): void {
    this.doingRequest = false;
    this.ref.close(null);
  }
}
