import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Injectable, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, tap, take, mergeMap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { AccountService } from '../accounts/accounts.service';
import { NotifierService } from 'angular-notifier';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private accountService: AccountService,
    private notifierService: NotifierService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    this.notifierService.hideAll();
    console.log('---------------------------------------------');
    return this.accountService.getCurrentUser.pipe(
      take(1),
      mergeMap(async (user) => {
        console.log('🚀 ~ AuthGuard ~ mergeMap ~ user:', user);

        console.log('Token before call api: ', user?.getACToken());
        if (user?.getACToken() === null) {
          return false;
        }
        if (user?.getACToken()) {
          return true;
        }
        this.notifierService.notify(
          'warning',
          'Bạn cần phải đăng nhập lại để tiếp tục!'
        );
        return this.router.createUrlTree(['/auth/login']);
      }),
      mergeMap((result) => from(Promise.resolve(result)))
    );
  }
}
