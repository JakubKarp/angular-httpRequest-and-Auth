// interceptory są przydatne. np, jeśli do każdego POST musisz dodać nagłówek,
// żeby autentykować użytkownika.
// interceptor zaczyna działać/wykona swój kod zanim request wyjdzie z apki
// po zarejestrowaniu w providers w app.module idzie to przy każdym requeście - post, get, delete

import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEventType,
} from '@angular/common/http';
import { tap } from 'rxjs/operators';

export class AuthInterceptorService implements HttpInterceptor {
  //  // najprostszy interceptor działający na wszystkie posty/gety
  //   intercept( req: HttpRequest<any>, next: HttpHandler ) {
  //     console.log('Request is ready to go');
  //     return next.handle(req);
  //   }
  // }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // możesz kontrolować, na jakie url api ma iść interceptor
    // if(req.twójurl/api/get)
    // console.log('Request is ready to go');
    // tu można modyfikować body requestu
    const modifedRequest = req.clone({
      // nowy url
      // url: 'cc-bb.pl',
      // params
      // params: req.params.append('hej-param', 'tratatam'),
      // headers - autentykacja !!!!
      headers: req.headers.append('Auth', 'xyz-autentykacja-!!!!'),
    });

    // to zawsze wychodzi w takiej postaci, ale przekazujemy zmodyfikowany requestem
    return next.handle(modifedRequest);
    // to jest opcjonalne, jeśli chcesz coś zrobić z przychodzącym responsem
    // .pipe(tap( event => {
    //   console.log('OH event', event);
    //   if (event.type === HttpEventType.Response) {
    //     console.log('Response arrived, body data:');
    //     console.log(event.body);
    //    }
    // }));
  }
}
