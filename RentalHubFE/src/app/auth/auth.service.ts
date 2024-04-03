import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { resDataDTO } from '../shared/resDataDTO';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { handleError } from '../shared/handle-errors';
import { User } from './user.model';
import { AccountService } from '../accounts/accounts.service';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isUser = false;
  isHost = true;

  user = new BehaviorSubject<User | null>(null);
  resetToken: User | undefined;
  private tokenExpirationTimer: any;

  resetUser: User | undefined;

  constructor(
    private http: HttpClient,
    private router: Router,
    private accountService: AccountService,
    private notifierService: NotifierService
  ) {
    this.user.subscribe((user) => {
      if (user) {
        this.resetUser = user;
      }
    });
  }

  login(email: string, pw: string) {
    console.log('Is logging...................');
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'auth/login', {
        email: email,
        password: pw,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          this.handleAuthentication(res.message);
        })
      );
  }

  autoLogin() {
    console.log('On auto login ...');
    const userData = localStorage.getItem('userData');
    console.log('🚀 ~ AuthService ~ autoLogin ~ userData:', userData);
    if (userData) {
      let expirationDuration = 0;
      const user: any = JSON.parse(userData);
      const loadedUserData = new User(
        '',
        user.email,
        '',
        '',
        user.accessToken,
        user.expiredAccess
      );
      this.accountService.setCurrentUser(loadedUserData);
      if (loadedUserData.getACToken()) {
        this.accountService.setCurrentUser(loadedUserData);

        expirationDuration = loadedUserData.getExpiredAccess() - Date.now();
      }
      console.log('expiration duration:', expirationDuration);
      this.autoLogout(expirationDuration);
    } else {
      return;
    }
  }

  signup(email: string, pw: string, _pwconfirm: string) {
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'users/accounts/registor', {
        _email: email,
        _pw: pw,
        _pwconfirm: _pwconfirm,
      })
      .pipe(catchError(handleError));
  }

  logout() {
    console.log('On loging out ...');
    this.router.navigate(['/auth/login']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'auth/logout', {})
      .pipe(
        catchError(handleError),
        tap((res) => {
          this.notifierService.hideAll();
          this.notifierService.notify('success', 'Đăng  xuất thành công!');
          this.accountService.setCurrentUser(null);
        })
      );
  }

  autoLogout(expirationDuration: number) {
    console.log('auto loggin out...');
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
      this.isUser = false;
      if (localStorage.getItem('userData')) {
        localStorage.removeItem('userData');
      }
    }, expirationDuration);
  }

  // resetACToken(refreshToken: string) {
  //   console.log('On reseting token ...');
  //   return this.http
  //     .post<resDataDTO>(environment.baseUrl + 'users/accounts/reset-token', {
  //       refreshToken: refreshToken,
  //     })
  //     .pipe(
  //       catchError(handleError),
  //       tap((res) => {
  //         console.log('on reset AC token function');
  //         console.log(res);
  //         // cập nhật lại user với AC token mới
  //         this.accountService.getCurrentUser.subscribe((currentUser) => {
  //           console.log('Current user: ', currentUser);
  //           if (currentUser) {
  //             console.log('On updating user with reseting AC token...');
  //             this.resetUser = new User(
  //               currentUser._id,
  //               currentUser._fname,
  //               currentUser._lname,
  //               currentUser._phone,
  //               currentUser._dob,
  //               currentUser._active,
  //               currentUser._rating,
  //               currentUser._email,
  //               currentUser._address,
  //               currentUser._avatar,
  //               currentUser._role,
  //               currentUser._isHost,
  //               res.data.refreshToken,
  //               res.data.expiredRefresh,
  //               res.data.accessToken,
  //               res.data.expiredAccess
  //             );
  //             this.isHost = currentUser._isHost;
  //             console.log('After reset token, isHost: ', this.isHost);
  //             localStorage.setItem('userData', JSON.stringify(this.resetUser));
  //           }
  //         });
  //         if (this.resetUser) {
  //           this.accountService.setCurrentUser(this.resetUser);
  //           console.log(
  //             '🚀 ~ file: auth.service.ts:168 ~ AuthService ~ tap ~ this.user.next:',
  //             this.accountService.getCurrentUser
  //           );
  //         }
  //       })
  //     );
  // }

  // verifyAccount(phone: string) {
  //   console.log('On verifying account ...');
  //   return this.http
  //     .post(environment.baseUrl + 'users/accounts/verify-host', {
  //       _phone: phone,
  //     })
  //     .pipe(catchError(handleError));
  // }

  private handleAuthentication(data: any) {
    const user = new User(
      '',
      data.email,
      '',
      '',
      data.accessToken,
      data.expiredAccess
    );
    this.accountService.setCurrentUser(user);
    this.accountService.getCurrentUser.subscribe((user) => {
      console.log('Set current user successfully!', user);
    });
    localStorage.setItem('userData', JSON.stringify(user));
    const expirationDuration = data.expiredAccess - Date.now();
    console.log('expiration duration:', expirationDuration);
    this.autoLogout(expirationDuration);
  }
}
