import { Component, OnInit } from '@angular/core';
import {
  Firestore,
  getDocs,
  collection,
  query,
  where,
} from '@angular/fire/firestore';
import { AuthServiceService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  userData?: any;
  profile: any;

  isCollapsed: boolean = false;
  collapsed() {
    this.isCollapsed = this.isCollapsed ? false : true;
  }
  constructor(
    private authService: AuthServiceService,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {}

  getUserData() {
    const data = localStorage.getItem('user');
    if (data) {
      this.userData = data;
      const dbinstance = collection(this.firestore, 'users');
      const q = query(dbinstance, where('uid', '==', this.userData));
      getDocs(q).then((res: any) => {
        this.profile = [
          ...res.docs.map((doc: any) => {
            return { id: doc.id, ...doc.data() };
          }),
        ];

        this.profile = this.profile[0];
      });
    } else {
      this.authService.logout();
    }
  }

 
}
