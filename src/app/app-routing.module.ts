import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { PrimeModule } from './modules/prime.module';
import { CallBackService } from './services/callback/callback.service';
import { CityService } from './services/city/city.service';
import { CountryService } from './services/country/country.service';
import { ExternalService } from './services/external/external.service';
import { StateService } from './services/state/state.service';
import { UserService } from './services/user/user.service';
import { AddressBookAddComponent } from './views/address-book/address-book-add/address-book-add.component';
import { AddressBookDeleteComponent } from './views/address-book/address-book-delete/address-book-delete.component';
import { AddressBookDetailComponent } from './views/address-book/address-book-detail/address-book-detail.component';
import { AddressBookEditComponent } from './views/address-book/address-book-edit/address-book-edit.component';
import { AddressBookFilterComponent } from './views/address-book/address-book-filter/address-book-filter.component';
import { AddressBookComponent } from './views/address-book/address-book.component';
import { ErrorComponent } from './views/shared/error/error.component';
import { LayoutComponent } from './views/shared/layout/layout.component';
import { NotFoundComponent } from './views/shared/not-found/not-found.component';
import { UserAddComponent } from './views/user/user-add/user-add.component';
import { UserComponent } from './views/user/user.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: AddressBookComponent },
    ]
  },

  { path: 'error', component: ErrorComponent },
  { path: 'notfound', component: NotFoundComponent },
  { path: '**', redirectTo: '/notfound' },
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    PrimeModule,
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', useHash: false }),
    // RouterModule.forRoot(routes)
  ],
  declarations: [
    UserComponent,
    UserAddComponent,
    
    AddressBookComponent,
    AddressBookAddComponent,
    AddressBookEditComponent,
    AddressBookDeleteComponent,
    AddressBookFilterComponent,
    AddressBookDetailComponent
  ],
  exports: [
    RouterModule,
    PrimeModule
  ],
  providers: [
    UserService,
    // GroupService,

    CallBackService,
    MessageService,
    DialogService,

    CountryService,
    StateService,
    CityService,
    ExternalService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppRoutingModule { }
