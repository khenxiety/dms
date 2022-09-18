import { Component, OnInit } from '@angular/core';
import {
  addDoc,
  collection,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
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
  constructor(
    private firestore: Firestore,
    private toastr: ToastrService,
    private spinnr: NgxSpinnerService
  ) {}

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

          console.log(this.userData[0]);
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }

  getRequests() {
    const dbinstance = collection(this.firestore, 'requests');

    const uid = localStorage.getItem('user');
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

          this.spinnr.hide();

          console.log(this.requestsData);
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }
  getFiles() {
    const dbinstance = collection(this.firestore, 'documents');

    getDocs(dbinstance)
      .then((res: any) => {
        this.documentsList = [
          ...res.docs.map((doc: any) => {
            return { id: doc.id, ...doc.data() };
          }),
        ];

        this.spinnr.hide();

        console.log(this.documentsList);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
  selectFiles(event: any) {
    console.log(event);
  }

  addRequest() {
    this.spinnr.show();
    // this.faculty = this.faculty.filter(
    //   (item: { sub_type: string }) => item.sub_type == 'permanent'
    // );
    const uid = localStorage.getItem('user');
    const date = new Date();
    const fileName = this.documentsList.filter(
      (res: { id: string }) => res.id == this.formBuild.value.file
    );
    console.log(fileName[0].fileName);
    if (this.formBuild.valid) {
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

      this.formBuild.markAllAsTouched();
    }
  }
}
