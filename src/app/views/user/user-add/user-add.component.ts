import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddressBookModel } from 'src/app/models/address-book-model';
import { CityModel, CityFilter } from 'src/app/models/city-model';
import { CountryModel, CountryFilter } from 'src/app/models/country-model';
import { StateModel, StateFilter } from 'src/app/models/state-model';
import { UserModel, UserFilter } from 'src/app/models/user-model';
import { CallBackService } from 'src/app/services/callback/callback.service';
import { CityService } from 'src/app/services/city/city.service';
import { CountryService } from 'src/app/services/country/country.service';
import { StateService } from 'src/app/services/state/state.service';
import { UserService } from 'src/app/services/user/user.service';
import { DtUtils } from 'src/app/utils/data-table/dt-utils/dt-utils';
import { EndpointName, ApiName } from 'src/environment';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent extends DtUtils<UserModel, UserFilter> implements OnInit {
  //para saber cuand se realiza una llamada ajax
  doingRequest: boolean = false;

  // allGroups: GroupModel[] = [];

  allCountries: CountryModel[] = [];

  allStates: StateModel[] = [];

  allCities: CityModel[] = [];



  //El formulario reactivo
  frmUser: FormGroup = this._frmBuilder.group({
    // workEmail: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    mLastName: new FormControl(''),
    // group: new FormControl(null, [Validators.required]),
    enabled: new FormControl(true, [Validators.required]),
  });

  //El formulario reactivo
  frmAddressBook: FormGroup = this._frmBuilder.group({
    alias: new FormControl(''),
    phone: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]),


    countryId: new FormControl(0),
    country: new FormControl(null),
    stateId: new FormControl(0),
    state: new FormControl(null),
    cityId: new FormControl(0),
    city: new FormControl(null),

    street: new FormControl(''),
    subdivision: new FormControl(''),
    reference: new FormControl(''),
    zipCode: new FormControl(''),
  });

  //El constructor
  constructor(
    private _frmBuilder: FormBuilder,
    private userService: UserService,
    private msg: MessageService,
    private cd: ChangeDetectorRef,
    private _callBack: CallBackService,
    public ref: DynamicDialogRef,
    // private securityGroupService: GroupService,
    private securityCountryService: CountryService,
    private securityStateService: StateService,
    private securityCityService: CityService,
  ) {
    super('userId', EndpointName.User);
  }

  //Inicializa cuando se muestra la pantalla
  ngOnInit(): void {
    // this.getAllGroups();
       this.getAllCountries('');
  }

  //limpia e inicializa los formularios
  public clear() {
    this.frmUser.markAsUntouched();
    this.frmUser.markAsPristine();

    // this.frmUser.markAsUntouched();
    // this.frmUser.markAsPristine();
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
    this.frmUser.patchValue({
      state: null,
      city: null,
    });
  }

  //clear city dropdown
  onClearCity(event: any) {
    this.frmUser.patchValue({
      city: null,
    });
  }



  //Obtiene los paises que se pueden elegir
  private getAllCountries(text: string) {
    let params = <CountryFilter>{
      name: text,
      enabled: true
    };
    this.securityCountryService.getAll(params)
      .subscribe({
        next: (response: any) => {

          this.allCountries = <CountryModel[]>response.body.data;

          if (this.allCountries.length == 1) {
            let countryDefault: CountryModel = <CountryModel>this.allCountries[0];
            this.frmUser.patchValue({
              country: countryDefault,
              countryId: countryDefault.countryId
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          this.allCountries = [];
          this.allStates = [];
          this.allCities = [];
          const _msg = (err.error != null ? err.error.message : err.message || err.statusText);
          const _severity = err.status == 404 ? 'info' : 'error';
          this.msg.add({ severity: _severity, summary: 'Error', detail: _msg });
        }
      });
  }

  //Obtiene los estados que se pueden elegir en cada pais
  private getAllStates(text: string) {
    let params = <StateFilter>{
      countryId: this.frmUser.controls['country'].value.countryId,
      name: text,
      enabled: true
    };
    this.securityStateService.getAll(params)
      .subscribe({
        next: (response: any) => {


          this.allStates = <StateModel[]>response.body.data;
        },
        error: (err: HttpErrorResponse) => {
          this.allStates = [];
          this.allCities = [];
          const _msg = (err.error != null ? err.error.message : err.message || err.statusText);
          const _severity = err.status == 404 ? 'info' : 'error';
          this.msg.add({ severity: _severity, summary: 'Error', detail: _msg });
        }
      });
  }


  //Obtiene las ciudades que se pueden elegir en cada estado de cada pais
  private getAllCities(text: string) {
    let _filter: CityFilter = <CityFilter>{
      countryId: this.frmUser.controls['country'].value.countryId,
      stateId: this.frmUser.controls['state'].value.stateId,
      name: text,
      enabled: true
    };
    this.securityCityService.getAll(_filter)
      .subscribe({
        next: (response: any) => {

          this.allCities = <CityModel[]>response.body.data;

        },
        error: (err: HttpErrorResponse) => {
          this.allCities = [];
          const _msg = (err.error != null ? err.error.message : err.message || err.statusText);
          const _severity = err.status == 404 ? 'info' : 'error';
          this.msg.add({ severity: _severity, summary: 'Error', detail: _msg });
        }
      });
  }

  // //Obtiene los groups que se podrán utilizar
  // private getAllGroups() {
  //   this.securityGroupService.getAll(true)
  //     .subscribe({
  //       next: (response: any) => {
  //         this.allGroups = response.body.data;
  //         if (this.allGroups.length == 1) {
  //           let groupDefault: GroupModel = <GroupModel>this.allGroups[0];
  //           this.frmUser.patchValue({
  //             group: groupDefault,
  //           });
  //         }
  //       },
  //       error: (err: HttpErrorResponse) => {
  //         this.allGroups = [];
  //         const _msg = (err.error != null ? err.error.message : err.message || err.statusText);
  //         const _severity = err.status == 404 ? 'info' : 'error';
  //         this.msg.add({ severity: _severity, summary: 'Error', detail: _msg });
  //       }
  //     });
  // }



  // Envia los datos al back-end para que sean almacenados
  save() {
    let _input: UserModel = this._wrapData();
    if (!this.validateBeforeSave()) {
      return;
    }

    this.doingRequest = true;
    this.userService.post(ApiName.Default, EndpointName.User, _input)
      .subscribe({
        next: (response: any) => {
          this.doingRequest = false;

          this.msg.add({ severity: 'success', summary: 'Felicidades!', detail: 'El usuario ha sido creado.', });
          this.clear();
          this.ref.close(response.data);
        },
        error: (err: HttpErrorResponse) => {
          this.doingRequest = false;
          const _msg = (err.error != null ? err.error.message : err.message || err.statusText);
          const _severity = err.status == 404 ? 'info' : 'error';
          this.msg.add({ severity: _severity, summary: 'Error', detail: _msg });
        },
      });
  }

  //ejecuta acciones antes de guardar como validaciones, formateos, etc
  private validateBeforeSave(): boolean {
    return this.frmUser.valid && this.frmUser.valid;
  }

  //obtiene los datos formateados para realizar la llamada al back-end
  public _wrapData(): UserModel {
    let addrBook: AddressBookModel = Object.assign({}, <AddressBookModel>this.frmUser.value);
    addrBook.countryId = addrBook.country == null ? null : addrBook.country.countryId;
    addrBook.stateId = addrBook.state == null ? null : addrBook.state.stateId;
    addrBook.cityId = addrBook.city == null ? null : addrBook.city.cityId;
    addrBook.country = null;
    addrBook.state = null;
    addrBook.city = null;


    let _user: UserModel = Object.assign({}, <UserModel>this.frmUser.value);
    // _user.groupId = (<GroupModel>_user.group).groupId;
    _user.addressBook = addrBook;


    return _user;
  }

  //close this dialog
  close(): void {
    this.doingRequest = false;
    this.ref.close(null);
  }
}
