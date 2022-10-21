import { Component, OnInit } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: any;
  password: any;

  isAuth: any;
  constructor(
    private router: Router,
    private auth: Auth,
    private toastr: ToastrService,
    private authService: AuthServiceService,
    private spinner: NgxSpinnerService
  ) {
    // this.authService.isLoggedIn();
  }

  ngOnInit(): void {}

  signIn() {
    this.spinner.show();
    this.authService.login(this.email, this.password);
  }

  showPassword(password: any) {
    password.type = password.type === 'password' ? 'text' : 'password';
  }
}
