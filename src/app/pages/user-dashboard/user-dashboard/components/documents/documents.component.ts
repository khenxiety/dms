import { Component, OnInit } from '@angular/core';
import {
  collection,
  Firestore,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { AuthServiceService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent implements OnInit {
  userData: any;
  profile: any;

  constructor(
    private firestore: Firestore,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.getUserData();
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
}
