import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpHeaders,
} from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AccountService } from '../accounts/accounts.service';
import { NotifierService } from 'angular-notifier';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    // private authService: AuthService,
    private router: Router,
    private accountService: AccountService,
    private notifierService: NotifierService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.accountService.getCurrentUser.pipe(
      take(1),
      exhaustMap((user) => {
        console.log('🚀 ~ AuthInterceptorService ~ exhaustMap ~ user:', user);

        if (!user) {
          // Không có thông tin user -> Không có ACToken -> Request gửi đi không có ACToken -> Văng lỗi Unauthorized => Thông báo
          return next.handle(req);
        } else {
          if (!user.getACToken()) {
            console.log('You need to login again!');
            this.router.navigate(['/auth/login']);
          } else {
            if (user.getACToken()) {
              console.log('ACToken in interceptor: ', user.getACToken());
              console.log('On adding ACToken to request header...');
              const headers = new HttpHeaders({
                Authorization: `Bearer ${user.getACToken()}`,
              });
              const tokenReq = req.clone({ headers: headers });
              return next.handle(tokenReq);
            }
          }
        }
        return next.handle(req);
      })
    );
  }
}
