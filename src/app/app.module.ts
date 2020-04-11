import { AuthInterceptorService } from './auth-interceptor';
import { LogginInterceptorService } from './loggin-interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  // żeby zarejestrować interceptor
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    // loggin musi być drugi, żeby zobaczyć auth key
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LogginInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
