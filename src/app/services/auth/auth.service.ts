import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { where } from 'firebase/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  userData: any;

  constructor(
    public jwtHelper: JwtHelperService,
    private auth: Auth,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private firestore: Firestore
  ) {}

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token')!;

    return !this.jwtHelper.isTokenExpired(token);
  }

  public isAdminAuthenticated(): boolean {
    const token = localStorage.getItem('token')!;

    return !this.jwtHelper.isTokenExpired(token);
  }
  isLoggedIn() {
    const token = localStorage.getItem('token')!;

    if (!token) {
      this.router.navigate(['login']);
    } else {
      this.router.navigate(['user-dashboard']);
    }
  }

  logout() {
    localStorage.clear();
    window.location.reload();
  }

  login(email: any, password: any) {
    const loginQuery = collection(this.firestore, 'users');

    const q = query(loginQuery, where('email', '==', email));

    getDocs(q).then((res: any) => {
      const userData = [
        ...res.docs.map((doc: any) => {
          return { id: doc.id, ...doc.data() };
        }),
      ];

      if (userData[0].type === 'user') {
        signInWithEmailAndPassword(this.auth, email, password)
          .then((res: any) => {
            if (res) {
              this.userData = this.auth.currentUser;
              localStorage.setItem('token', res.user.accessToken);
              localStorage.setItem('user', res.user.uid);
              this.toastr.success('Logged-in successfully');
              this.router.navigate(['user-dashboard']);
              this.spinner.hide();
            }
          })
          .catch((err: any) => {
            if (err.code == 'auth/invalid-email') {
              this.toastr.error('Login Error', 'Invalid email');
            }
            if (err.code == 'auth/missing-email') {
              this.toastr.error('Login Error', 'Missing email');
            }
            if (err.code == 'auth/internal-error') {
              this.toastr.error('Login Error', 'Missing password');
            }
            if (err.code == 'auth/wrong-password') {
              this.toastr.error('Login Error', 'Wrong password');
            }
            if (err.code == 'auth/user-not-found') {
              this.toastr.error('Login Error', 'User not found');
            }
            this.spinner.hide();
          });
      } else {
        this.toastr.error('Login Error', 'User not found');
        this.spinner.hide();
      }
    });
  }

  adminLogin(email: any, password: any) {
    const loginQuery = collection(this.firestore, 'users');

    const q = query(loginQuery, where('email', '==', email));

    getDocs(q).then((res: any) => {
      const userData = [
        ...res.docs.map((doc: any) => {
          return { id: doc.id, ...doc.data() };
        }),
      ];

      if (userData[0].type === 'admin') {
        signInWithEmailAndPassword(this.auth, email, password)
          .then((res: any) => {
            if (res) {
              this.userData = this.auth.currentUser;
              localStorage.setItem('token', res.user.accessToken);
              localStorage.setItem('user', res.user.uid);
              this.toastr.success('Logged-in successfully');
              this.router.navigate(['admin-dashboard']);
              this.spinner.hide();
            }
          })
          .catch((err: any) => {
            if (err.code == 'auth/invalid-email') {
              this.toastr.error('Login Error', 'Invalid email');
            }
            if (err.code == 'auth/missing-email') {
              this.toastr.error('Login Error', 'Missing email');
            }
            if (err.code == 'auth/internal-error') {
              this.toastr.error('Login Error', 'Missing password');
            }
            if (err.code == 'auth/wrong-password') {
              this.toastr.error('Login Error', 'Wrong password');
            }
            if (err.code == 'auth/user-not-found') {
              this.toastr.error('Login Error', 'User not found');
            }
            this.spinner.hide();
          });
      } else {
        this.toastr.error('Login Error', 'User not admin');
        this.spinner.hide();
      }
    });
  }
}
