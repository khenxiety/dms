import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  deleteObject,
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { concat, concatMap, from } from 'rxjs';
import { UploadServiceService } from 'src/app/services/upload-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
  deleteDoc,
  doc,
} from '@angular/fire/firestore';

export interface DataItems {
  id: any;
  name: any;
  file: any;
  description: any;
  classification: any;
  fileType: any;
  user: any;
  date: any;
  campus: any;
  action: any;
}

@Component({
  selector: 'app-document-table',
  templateUrl: './document-table.component.html',
  styleUrls: ['./document-table.component.scss'],
})
export class DocumentTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<DataItems>;
  dataSource: MatTableDataSource<DataItems>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'id',
    'name',
    'description',
    'classification',
    'file type',
    'user',
    'date',
    'campus',
    'action',
  ];
  public progress: Number = 0;

  public formBuild: FormGroup = new FormGroup({});
  public updateForm: FormGroup = new FormGroup({});

  file!: File;

  dataItems: any;
  deleteBoolean: boolean = false;

  constructor(
    private fileupload: UploadServiceService,
    private toastr: MatSnackBar,
    private storage: Storage,
    private formBuilder: FormBuilder,
    private firestore: Firestore,
    private spinner: NgxSpinnerService,
    private toast: ToastrService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit(): void {
    this.spinner.show();
    const dbinstance = collection(this.firestore, 'documents');
    getDocs(dbinstance)
      .then((res: any) => {
        this.dataItems = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];

        this.dataSource.data = this.dataItems as DataItems[];
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.table.dataSource = this.dataSource;
        console.log(this.dataItems);

        this.spinner.hide();
      })
      .catch((err: any) => {
        console.log(err.message);
      });
  }

  ngOnInit(): void {
    this.buildForm();
  }
  updateBuildForm(data: any) {
    console.log(data);
    this.formBuild = new FormGroup({
      description: new FormControl(data.description || '', Validators.required),
      file: new FormControl(data.file || '', Validators.required),

      fileType: new FormControl(data.fileType || '', Validators.required),

      classification: new FormControl(
        data.classification || '',
        Validators.required
      ),

      user: new FormControl(data.user || '', Validators.required),
      campus: new FormControl(data.campus || '', Validators.required),
    });
  }
  buildForm() {
    this.formBuild = new FormGroup({
      description: new FormControl('', Validators.required),
      file: new FormControl('', Validators.required),

      fileType: new FormControl('', Validators.required),

      classification: new FormControl('', Validators.required),

      user: new FormControl('', Validators.required),
      campus: new FormControl('', Validators.required),
    });
  }

  fileChange(event: any) {
    this.file = event.target.files[0];
    console.log('File Selected');
  }

  uploadFile(event: any) {
    this.spinner.show();

    if (this.formBuild.valid) {
      const storageRef = ref(this.storage, `documents/${this.file.name}`);
      const upload = uploadBytesResumable(storageRef, this.file);

      upload.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.progress = progress;
          console.log(progress);

          if (progress === 100) {
            setTimeout(() => {
              getDownloadURL(upload.snapshot.ref).then((url) => {
                this.createDocument(url, upload.snapshot.metadata);
              });
            }, 2000);
          }
        },
        () => {
          getDownloadURL(upload.snapshot.ref).then((url) => {
            console.log('dlurl', url);
          });
        }
      );
    } else {
      this.formBuild.markAllAsTouched();
    }
  }

  createDocument(fileUrl: any, snap: any) {
    console.log(snap);
    let data = {
      campus: this.formBuild.value.campus,
      classification: this.formBuild.value.classification,
      dateAdded: snap.timeCreated,
      description: this.formBuild.value.description,
      file: snap.name,
      fileName: snap.name,
      fileType: this.formBuild.value.fileType,
      fileUrl: fileUrl,
      uid: 'test',
      user: this.formBuild.value.user,
    };

    const dbinstance = collection(this.firestore, 'documents');
    addDoc(dbinstance, data)
      .then((res) => {
        console.log(data, res);
        this.toast.success('Document Uploaded!');
        this.ngAfterViewInit();
        this.progress = 0;
        this.spinner.hide();
        // window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  deleteFile() {
    const storageRef = ref(
      this.storage,
      `documents/Bulk Product Upload Template.xlsx`
    );

    deleteObject(storageRef).then(() => {
      console.log('deleted');
    });
  }

  deleteDocument(data: any) {
    console.log(data.fileName);
    const storageRef = ref(this.storage, `documents/${data.fileName}`);

    deleteObject(storageRef).then(() => {
      const dbinstance = doc(this.firestore, 'documents/' + data.id);
      deleteDoc(dbinstance)
        .then((res) => {
          this.toast.success('Document Deleted!');
          this.deleteBoolean = false;
          this.spinner.hide();

          this.ngAfterViewInit();
        })
        .catch((err) => {
          console.log(err);
          this.toast.success('Document Uploaded!');
        });
    });
  }
}
