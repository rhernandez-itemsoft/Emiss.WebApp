import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorComponent } from './views/shared/error/error.component';
import { LayoutComponent } from './views/shared/layout/layout.component';
import { NotFoundComponent } from './views/shared/not-found/not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    NotFoundComponent,
    LayoutComponent,
  ],
  imports: [
    AppRoutingModule,
  ],
  exports:[
   // AppRoutingModule
  ],
 
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule { }
