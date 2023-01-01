
import { HTTP_INTERCEPTORS, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';

import { routes } from '../app-routing.module';
import { HttpErrorInterceptor } from './http-error.interceptor';

describe('HttpErrorInterceptor', () => {
  let client: HttpClient;
  let controller: HttpTestingController;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let router: Router;
  let routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async () => {

    await TestBed
      .configureTestingModule({
        teardown: { destroyAfterEach: false },
        imports: [
          HttpClientTestingModule,
          RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', useHash: false }),
        ],
        providers: [
          {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true
          },
          { provide: Router, useValue: routerSpy }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['GET']);
    client = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });



  it('Error 404', () => {

    client.get<string>('https://secure.testurl.com/success')
      .subscribe({
        next(responseOk) {
          expect(responseOk).toBeTruthy();
        },
        error(error) {
          expect(error.status).toEqual(404);
        }
      });

    const req = controller.expectOne('https://secure.testurl.com/success');

    req.flush(
      'Not Found',
      {
        status: 404,
        statusText: 'Not Found',
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      });

    controller.verify();
  });

  it('Error 0', () => {

    client.get<string>('https://secure.testurl.com/success')
      .subscribe({
        next(responseOk) {
          expect(responseOk).toBeTruthy();
        },
        error(error) {
          expect(error.status).toBeGreaterThanOrEqual(503);
        }
      });

    const req = controller.expectOne('https://secure.testurl.com/success');

    req.flush(
      'Not Found',
      {
        status: 0,
        statusText: 'Not Found',
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      });

    controller.verify();
  });

  ///https://stackoverflow.com/questions/55773888/how-to-unit-test-router-navigate-in-angular-app
  // https://stackoverflow.com/questions/55773888/how-to-unit-test-router-navigate-in-angular-app#:~:text=1)%20Import%20the%20Router%20from,it%20out%20for%20a%20routerSpy.&text=3)%20Finally%2C%20create%20routerSpy%20and,to%20watch%20the%20navigate%20method.
  it('Error 401 - redirige a /login', () => {
    client.get<string>('https://secure.testurl.com/redirect_unknow')
      .subscribe({
        next(responseOk) {
          expect(responseOk).toBeTruthy();
        },
        error(httpErrorResponse) {
          expect(httpErrorResponse.status).toEqual(401);
          expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
          expect(httpErrorResponse.error.redirect).toEqual('/login');
        }
      });

    const req = controller.expectOne('https://secure.testurl.com/redirect_unknow');

    req.flush(
      'Redirect',
      {
        status: 401,
        statusText: 'Redirect',
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      });
    controller.verify();
  });

  it('Error 500x', () => {

    client.get<string>('https://secure.testurl.com/success')
      .subscribe({
        next(responseOk) {
          expect(responseOk).toBeTruthy();
        },
        error(error) {
          expect(error.status).toEqual(500);
        }
      });

    const req = controller.expectOne('https://secure.testurl.com/success');

    req.flush(
      'Any Error',
      {
        status: 500,
        statusText: 'Any Error',
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      });

    controller.verify();
  });

});
