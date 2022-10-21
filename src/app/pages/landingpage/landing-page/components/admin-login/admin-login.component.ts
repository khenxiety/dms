import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent implements OnInit {
  email: any;
  password: any;

  isAuth: any;
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthServiceService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {}

  login() {
    this.spinner.show();
    this.authService.adminLogin(this.email, this.password);
  }

  showPassword(password: any) {
    password.type = password.type === 'password' ? 'text' : 'password';
  }
}
