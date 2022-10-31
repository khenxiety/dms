import { Component, HostListener, OnInit } from '@angular/core';
import {
  Firestore,
  getDocs,
  collection,
  query,
  where,
} from '@angular/fire/firestore';
import { AuthServiceService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
})
export class UserDashboardComponent implements OnInit {
  userData?: any;
  profile: any;

  isCollapsed: boolean = false;

  isCollapsed2: boolean = false;
  imageUrl: any = '';
  constructor(
    private authService: AuthServiceService,
    private firestore: Firestore
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth <= 768) {
      this.isCollapsed = true;
    } else {
      this.isCollapsed = false;
    }
  }
  ngOnInit(): void {
    this.getUserData();
  }

  isAccordOpen() {
    this.isCollapsed2 = this.isCollapsed2 ? false : true;
    this.isCollapsed = false;
  }
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

  collapsed() {
    this.isCollapsed = this.isCollapsed ? false : true;
  }
}
