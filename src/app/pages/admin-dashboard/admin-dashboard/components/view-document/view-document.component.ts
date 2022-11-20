import { Component, OnInit } from '@angular/core';
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  Firestore,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.scss'],
})
export class ViewDocumentComponent implements OnInit {
  documentData: Array<any> = [];
  documentId: any;
  public formBuild: FormGroup = new FormGroup({});
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
  editData: boolean = false;
  constructor(
    private fireStore: Firestore,
    private activatedRoute: ActivatedRoute,
    private firestore: Firestore,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _location: Location
  ) {
    this.documentId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.spinner.show();

    this.buildForm(this.documentData);
    this.getData();
  }

  getData() {
    if (!this.documentId) return console.log('Please Select a document');
    const dataInstance = collection(this.fireStore, 'documents');

    getDocs(dataInstance)
      .then((res: any) => {
        console.log(res);
        this.documentData = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
        this.documentData = this.documentData.filter(
          (res: any) => res.id == this.documentId
        );
        this.spinner.hide();

        this.buildForm(this.documentData);
      })
      .catch((err: any) => {
        console.log(err);
      });
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

    console.log(this.formBuild.value);
  }

  removeAccess(access: any, documentId: any) {
    let data = {
      canAccess: arrayRemove({
        accessId: access.accessId,
        accessEmail: access.accessEmail,
      }),
    };
    const updatedoc = doc(this.firestore, 'documents', documentId);
    updateDoc(updatedoc, data)
      .then((res: any) => {
        console.log(res);
        this.spinner.hide();
        this.toastr.success('Access Removed');
        // this.logsService.addLogsService(
        //   `Updated Access `,
        //   'Admin',
        //   'Admin',
        //   'Admin'
        // );
        this.ngOnInit();

        // this.formBuild.reset();
      })
      .catch((err: any) => {
        console.log(err.message);
      });
    this.ngOnInit();
  }

  copy(data: any) {
    navigator.clipboard.writeText(data);
    this.toastr.success(`Link copied to clipboard`);
  }

  editDocument() {
    this.editData = this.editData ? false : true;

    if (this.editData === true) this.formBuild.enable();
    if (this.editData === false) this.formBuild.disable();

    window.scroll({
      top: 0,
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
      });
  }

  back() {
    this._location.back();
  }
}
