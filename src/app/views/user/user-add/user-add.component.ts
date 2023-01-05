import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CityModel } from 'src/app/models/city-model';
import { CountryModel } from 'src/app/models/country-model';
import { StateModel } from 'src/app/models/state-model';
import { UserModel, UserFilter } from 'src/app/models/user-model';
import { CallBackService } from 'src/app/services/callback/callback.service';
import { CityService } from 'src/app/services/city/city.service';
import { CountryService } from 'src/app/services/country/country.service';
import { ExternalService } from 'src/app/services/external/external.service';
import { StateService } from 'src/app/services/state/state.service';
import { UserService } from 'src/app/services/user/user.service';
import { DtUtils } from 'src/app/utils/data-table/dt-utils/dt-utils';
import { EndpointName, ApiName } from 'src/environment';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent extends DtUtils<UserModel, UserFilter>  {

  //para saber cuand se realiza una llamada ajax
  doingRequest: boolean = false;

  allCountries: CountryModel[] = [];

  allStates: StateModel[] = [];

  allCities: CityModel[] = [];


  //El formulario reactivo
  frmUser: FormGroup = this._frmBuilder.group({
    // workEmail: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]),
    firstName: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    mLastName: new FormControl(''),
    enabled: new FormControl(true, [Validators.required, Validators.minLength(3)]),
  });


  //El constructor
  constructor(
    private _frmBuilder: FormBuilder,
    private userService: UserService,
    private externalService: ExternalService,
    private msg: MessageService,
    private cd: ChangeDetectorRef,
    private _callBack: CallBackService,
    public ref: DynamicDialogRef,
    // private securityGroupService: GroupService,
    private countryService: CountryService,
    private stateService: StateService,
    private cityService: CityService,
    private cdRef: ChangeDetectorRef
  ) {
    super('userId', EndpointName.User);
  }


  //limpia e inicializa los formularios
  public clear() {
    this.frmUser.markAsUntouched();
    this.frmUser.markAsPristine();
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
  //         const _msg = (err.error != null && err.error.message  ? err.error.message : err.message || err.statusText);
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
          const _msg = (err.error != null && err.error.message ? err.error.message : err.message || err.statusText);
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
    let _user: UserModel = Object.assign({}, <UserModel>this.frmUser.value);
    return _user;
  }

  //close this dialog
  close(): void {
    this.doingRequest = false;
    this.ref.close(null);
  }
}
