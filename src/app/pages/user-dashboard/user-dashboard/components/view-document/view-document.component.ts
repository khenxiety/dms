import { Component, OnInit } from '@angular/core';
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { deleteObject, ref, Storage } from '@angular/fire/storage';
import { Location } from '@angular/common';
@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.scss'],
})
export class ViewDocumentComponent implements OnInit {
  classificationContent: Array<any> = [
    'Administration',
    'Administrative Staff',
    'Collection Development, Organization and Preservation',
    'Services and Utilization',
    'Physical Set-up and Facilities',
    'Financial Support',
    'Linkages',
    'ISO Documents',
    'Other Documents',
  ];
  documentData: Array<any> = [];
  documentId: any;
  public uid: any;
  public formBuild: FormGroup = new FormGroup({});
  public editData: boolean = false;

  isLoading: boolean = false;
  profile: Array<any> = [];
  userId = localStorage.getItem('user');
  constructor(
    private fireStore: Firestore,
    private activatedRoute: ActivatedRoute,
    private firestore: Firestore,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private storage: Storage,
    private _location: Location
  ) {
    this.documentId = this.activatedRoute.snapshot.params['id'];

    this.uid = localStorage.getItem('user');
  }

  ngOnInit(): void {
    this.spinner.show();
    this.isLoading = true;
    this.getData();
    this.getUserData();
  }

  back() {
    this._location.back();
  }
  buildForm(data: any) {
    this.formBuild = new FormGroup({
      description: new FormControl(
        { value: data[0]?.description || '', disabled: true },

        Validators.required
      ),
      file: new FormControl(
        { value: data[0]?.fileName || '', disabled: true },
        Validators.required
      ),
      // fileName: new FormControl('', Validators.required),

      fileType: new FormControl(
        { value: data[0]?.fileType || '', disabled: true },
        Validators.required
      ),

      classification: new FormControl(
        { value: data[0]?.classification || '', disabled: true },
        Validators.required
      ),

      campus: new FormControl(
        { value: data[0]?.campus || '', disabled: true },
        Validators.required
      ),
    });
  }

  editDocument() {
    this.editData = this.editData ? false : true;

    if (this.editData === true) this.formBuild.enable();
    if (this.editData === false) this.formBuild.disable();

    window.scroll({
      top: 0,
    });
  }
  getUserData() {
    if (this.userId) {
      const dbinstance = collection(this.firestore, 'users');
      const q = query(dbinstance, where('uid', '==', this.userId));
      getDocs(q).then((res: any) => {
        this.profile = [
          ...res.docs.map((doc: any) => {
            return { id: doc.id, ...doc.data() };
          }),
        ];
      });
    } else {
      // this.authService.logout();
    }
  }
  copy(data: any) {
    navigator.clipboard.writeText(data);
    this.toastr.success(`Link copied to clipboard`);
  }
  getData() {
    if (!this.documentId) return console.log('Please Select a document');
    const dataInstance = collection(this.fireStore, 'documents');

    getDocs(dataInstance)
      .then((res: any) => {
        this.documentData = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
        this.documentData = this.documentData.filter(
          (res: any) => res.id == this.documentId
        );
        this.buildForm(this.documentData);
        this.spinner.hide();
        this.isLoading = false;
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
  deleteDocument(data: any) {
    this.spinner.show();
    const storageRef = ref(this.storage, `documents/${data[0].fileName}`);

    deleteObject(storageRef)
      .then(() => {
        const dbinstance = doc(this.firestore, 'documents/' + data[0].id);

        deleteDoc(dbinstance)
          .then((res) => {
            this.router.navigate(['/user-dashboard/documents/']);
            this.toastr.success('Document Deleted!', '', { timeOut: 1000 });
            this.spinner.hide();
          })
          .catch((err) => {
            console.log(err.code);
            this.toastr.error('Document Uploaded!');
          });
      })
      .catch((err: any) => {
        console.log(err.code);
        const dbinstance = doc(this.firestore, 'documents/' + data[0].id);

        deleteDoc(dbinstance)
          .then((res) => {
            this.ngOnInit();
            this.router.navigate(['/user-dashboard/documents/']);

            this.toastr.success('Document Deleted!', '', { timeOut: 1000 });
            this.spinner.hide();
          })
          .catch((err) => {
            console.log(err.code);
            this.toastr.error('Document Uploaded!', err.code);
          });

        this.spinner.hide();

        this.ngOnInit();
        this.toastr.error('Document deleted!', err.code);

        this.router.navigate(['/user-dashboard/documents/']);
      });
  }

  updateDocument(id: any) {
    this.spinner.show();
    let data = {
      fileName: this.formBuild.value.file,
      campus: this.formBuild.value.campus,
      fileType: this.formBuild.value.fileType,
      classification: this.formBuild.value.classification,
      description: this.formBuild.value.description,
    };
    const updateInstance = doc(this.fireStore, 'documents', id);

    updateDoc(updateInstance, data)
      .then((res: any) => {
        this.toastr.success('Document Updated');
        this.editDocument();
        this.ngOnInit();
        this.spinner.show();
      })
      .catch((err: any) => {
        console.log(err);
        this.toastr.success('Document failed to update', err.code);
      });
  }
  requestAccess(id: any) {
    this.router.navigate(['/user-dashboard/request-document', id]);
  }
  checkUser(id: any) {
    const user = id?.some((el: any) => el.accessId == this.uid);

    if (!user) {
      console.log('not user');
      return false;
    }
    return true;
  }
}
