import { Component, OnInit } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { NgxSpinnerService, Spinner } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
})
export class RequestsComponent implements OnInit {
  requestsData: Array<any> = [];
  documentsList: Array<any> = [];

  public formBuild: FormGroup = new FormGroup({});
  userData: any = [];

  documentId: any;
  selectedData: any;
  constructor(
    private firestore: Firestore,
    private toastr: ToastrService,
    private spinnr: NgxSpinnerService,
    private activatedRoute: ActivatedRoute
  ) {
    this.documentId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.spinnr.show();
    this.getRequests();
    this.getFiles();
    this.getUserData();
    this.buildForm();
  }

  buildForm() {
    this.formBuild = new FormGroup({
      file: new FormControl('', Validators.required),
      purpose: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
    });
  }
  getUserData() {
    const uid = localStorage.getItem('user');
    if (uid) {
      const dbinstance = collection(this.firestore, 'users');
      const q = query(dbinstance, where('uid', '==', uid));
      getDocs(q)
        .then((res: any) => {
          this.userData = [
            ...res.docs.map((doc: any) => {
              return { id: doc.id, ...doc.data() };
            }),
          ];

          this.spinnr.hide();
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }

  getRequests() {
    const uid = localStorage.getItem('user');

    const dbinstance = collection(this.firestore, 'requests');

    if (uid) {
      const q = query(
        dbinstance,
        orderBy('date', 'desc'),
        where('uid', '==', uid)
      );

      getDocs(q)
        .then((res: any) => {
          this.requestsData = [
            ...res.docs.map((doc: any) => {
              return { id: doc.id, ...doc.data() };
            }),
          ];

          this.getPendingRequests();

          this.spinnr.hide();
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }

  getPendingRequests() {
    const uid = localStorage.getItem('user');

    const dbinstance = collection(this.firestore, 'requests');

    if (uid) {
      const q = query(
        dbinstance,
        orderBy('date', 'desc'),
        where('uid', '==', uid)
      );

      getDocs(q)
        .then((res: any) => {
          let pendingRequests = [
            ...res.docs.map((doc: any) => {
              return { id: doc.id, ...doc.data() };
            }),
          ];

          this.spinnr.hide();

          pendingRequests.map((res) => {
            console.log(new Date(res.date).getDate(), new Date().getDate());

            if (
              res.expiration == new Date().toLocaleDateString() &&
              res.status == 'rejected'
            ) {
              const deleteRequest = doc(this.firestore, 'requests/' + res.id);

              deleteDoc(deleteRequest)
                .then((res) => {
                  console.log('Request expired');

                  this.toastr.info('Request Expired');
                  this.getRequests();
                })
                .catch((err) => {
                  console.log(err.code);
                });
            }
            // return new Date(res.date).getDate() + 7;
          });
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }
  getFiles() {
    const uid = localStorage.getItem('user');

    const dbinstance = collection(this.firestore, 'documents');

    if (this.documentId) {
      getDocs(dbinstance)
        .then((res: any) => {
          this.documentsList = [
            ...res.docs.map((doc: any) => {
              return { id: doc.id, ...doc.data() };
            }),
          ];

          this.documentsList = this.documentsList.filter(
            (item: { id: string }) => item.id == this.documentId
          );

          this.spinnr.hide();
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else {
      getDocs(dbinstance)
        .then((res: any) => {
          this.documentsList = [
            ...res.docs.map((doc: any) => {
              return { id: doc.id, ...doc.data() };
            }),
          ];

          this.documentsList = this.documentsList.filter((res: any) => {
            const user = res.canAccess?.some((el: any) => el.accessId == uid);

            if (!user) return res;
            return;
          });

          this.spinnr.hide();
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }
  selectFiles(event: any) {
    console.log(event);
  }

  addRequest() {
    // this.faculty = this.faculty.filter(
    //   (item: { sub_type: string }) => item.sub_type == 'permanent'
    // );

    if (this.formBuild.valid) {
      this.spinnr.show();

      const uid = localStorage.getItem('user');
      const date = new Date();
      const fileName = this.documentsList.filter(
        (res: { id: string }) => res.id == this.formBuild.value.file
      );
      if (uid) {
        let data = {
          campus: this.userData[0].campus,
          date: date.toString(),
          fileId: this.formBuild.value.file,
          fileRequested: fileName[0].fileName,
          requesterName: this.userData[0].email,
          status: 'pending',
          uid: this.userData[0].uid,
          message: this.formBuild.value.message,
          purpose: this.formBuild.value.purpose,
        };
        const dbInstance = collection(this.firestore, 'requests');

        addDoc(dbInstance, data)
          .then((res: any) => {
            console.log(res);
            this.spinnr.hide();
            this.toastr.success('Success', 'Request Added');

            this.formBuild.reset();

            this.getRequests();
          })
          .catch((err: any) => {
            console.log(err);
          });
      }
    } else {
      this.spinnr.hide();

      this.toastr.error('Pleaase fill up all the fields');
      this.formBuild.markAllAsTouched();
    }
  }
}
