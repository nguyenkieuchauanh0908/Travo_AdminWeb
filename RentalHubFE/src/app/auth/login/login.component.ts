import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { resDataDTO } from 'src/app/shared/resDataDTO';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginObs!: Observable<resDataDTO>;
  password: string = 'password';
  isPwShown: boolean = false;
  isLoading = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private notifierService: NotifierService
  ) {}

  ngOnInit(): void {
    this.password = 'password';
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const pw = form.value.password;

    this.loginObs = this.authService.login(email, pw);
    this.isLoading = true;
    this.notifierService.hideAll();
    this.loginObs.subscribe(
      (res) => {
        this.notifierService.notify('success', 'Đăng nhập thành công!');
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/dashboard/statistics']);
        }, 1000);
      },
      (errorMsg) => {
        this.isLoading = false;
        this.error = errorMsg;
        console.log(this.error);
        this.notifierService.notify('error', errorMsg);
      }
    );
  }

  onEyesSeePwClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.isPwShown = true;
    } else {
      this.password = 'password';
      this.isPwShown = false;
    }
  }
}
