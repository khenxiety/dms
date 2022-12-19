import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
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
  query,
  where,
  orderBy,
} from '@angular/fire/firestore';
import { LogsService } from 'src/app/services/logs/logs.service';
import { Router } from '@angular/router';

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
  @Input() currentUser: string = '';
  @Input() currentUserEmail: string = '';

  @Input() currentUserCampus: string = '';
  @Input() currentUserId: string = '';
  @Input() filterBy: string = '';

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
  fileRestriction: Array<any> = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];
  isFileValid: boolean = true;

  isSharedToMeOpened: boolean = false;

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
  campusesList: Array<any> = [
    'Pablo Borbon',
    'Alangilan',
    'ARASOF-Nasugbu',
    'Balayan',
    'Lemery',
    'Mabini',
    'JPLPC-Malvar',
    'Lipa',
    'Rosario',
    'San Juan',
    'Lobo',
  ];
  userId = localStorage.getItem('user');

  @ViewChild('closeModal', { static: false }) closeModal:
    | ElementRef
    | undefined;
  public formBuild: FormGroup = new FormGroup({});
  public updateForm: FormGroup = new FormGroup({});

  file!: File;

  dataItems: any;
  deleteBoolean: boolean = false;
  profile: Array<any> = [];

  selectedDocument: Array<any> = [];

  collapsed: boolean = false;
  constructor(
    private fileupload: UploadServiceService,
    private toastr: MatSnackBar,
    private storage: Storage,
    private formBuilder: FormBuilder,
    private firestore: Firestore,
    private spinner: NgxSpinnerService,
    private toast: ToastrService,
    private logsService: LogsService,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth <= 1100) {
      // this.isCollapsed = true;
      this.collapsed = true;
      if (this.filterBy != '') {
        this.displayedColumns = [
          'id',
          'name',
          // 'description',
          // 'file type',
          // 'date',
          // 'campus',
          'action',
        ];
      } else {
        this.displayedColumns = [
          'id',
          'name',
          // 'description',
          'classification',
          // 'file type',
          // 'date',
          // 'campus',
          'action',
        ];
      }
    } else {
      this.collapsed = false;

      if (this.filterBy != '') {
        this.displayedColumns = [
          'id',
          'name',
          'description',
          'file type',
          'date',
          'campus',
          'action',
        ];
      } else {
        this.displayedColumns = [
          'id',
          'name',
          // 'description',
          'classification',
          'file type',
          // 'date',
          // 'campus',
          'action',
        ];
      }
    }
  }
  ngAfterViewInit(): void {
    this.spinner.show();

    this.getUserData();
    if (this.filterBy != '') {
      const dbinstance = collection(this.firestore, 'documents');
      const q = query(
        dbinstance,
        where('classification', '==', this.filterBy),
        orderBy('dateAdded', 'desc')
      );
      this.isSharedToMeOpened = false;
      this.displayedColumns = [
        'id',
        'name',
        'description',
        'file type',
        'date',
        'campus',
        'action',
      ];

      getDocs(q)
        .then((res: any) => {
          this.dataItems = [
            ...res.docs.map((doc: any) => {
              return { ...doc.data(), id: doc.id };
            }),
          ];

          console.log(this.dataItems);
          this.dataSource.data = this.dataItems as DataItems[];
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.table.dataSource = this.dataSource;
          this.spinner.hide();
        })
        .catch((err: any) => {
          this.spinner.hide();
          console.log(err.message);
        });
    } else {
      this.isSharedToMeOpened = true;
      this.displayedColumns = [
        'id',
        'name',
        'classification',
        'file type',
        'action',
      ];
      const uid = localStorage.getItem('user');
      if (uid) {
        const dbinstance = collection(this.firestore, 'documents');
        const q = query(
          dbinstance,
          orderBy('dateAdded', 'desc'),
          where('canAccess', 'array-contains', {
            accessId: uid,
            accessEmail: this.currentUserEmail,
          })
        );
        getDocs(q)
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
            this.spinner.hide();
          })
          .catch((err: any) => {
            console.log(err.code);
            this.spinner.hide();
          });
      } else {
        console.log('Please Login');
      }
    }
  }

  ngOnInit(): void {
    this.buildForm();
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
  searchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  updateBuildForm(data: any) {
    // console.log(data);
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
      // fileName: new FormControl('', Validators.required),

      fileType: new FormControl('', Validators.required),

      classification: new FormControl('', Validators.required),

      campus: new FormControl('', Validators.required),
    });
  }

  fileChange(event: any) {
    console.log(event.target.files[0]);
    if (this.fileRestriction.includes(event.target.files[0].type)) {
      this.file = event.target.files[0];
      this.isFileValid = true;
    } else {
      this.toast.error('Invalid file format');
      this.isFileValid = false;
    }
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
      this.spinner.hide();
      console.log('error');
      this.formBuild.markAllAsTouched();
    }
  }

  createDocument(fileUrl: any, snap: any) {
    let data = {
      campus: this.formBuild.value.campus,
      classification: this.formBuild.value.classification,
      dateAdded: snap.timeCreated,
      description: this.formBuild.value.description,
      file: snap.name,
      fileName: snap.name,
      fileType: this.formBuild.value.fileType,
      fileUrl: fileUrl,
      uid: this.userId,
      canAccess: [
        { accessId: this.userId, accessEmail: this.currentUserEmail },
      ],
      user: this.currentUser,
    };

    const dbinstance = collection(this.firestore, 'documents');
    addDoc(dbinstance, data)
      .then((res) => {
        this.logsService.addLogsService(
          'Added a Document',
          this.currentUser,
          this.currentUserCampus,
          this.currentUserId
        );
        this.toast.success('Document Uploaded!', '', { timeOut: 1000 });
        this.closeModal!.nativeElement.click();
        this.ngAfterViewInit();
        this.progress = 0;
        this.spinner.hide();
        // window.location.reload();
      })
      .catch((err) => {
        console.log(err.code);
        this.toast.error(err.code);
        this.spinner.hide();
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

  selectToDelete(row: any) {
    this.selectedDocument = row;
  }
  deleteDocument(data: any) {
    this.spinner.show();
    const storageRef = ref(this.storage, `documents/${data.fileName}`);

    deleteObject(storageRef)
      .then(() => {
        const dbinstance = doc(this.firestore, 'documents/' + data.id);
        deleteDoc(dbinstance)
          .then((res) => {
            this.toast.success('Document Deleted!', '', { timeOut: 1000 });
            this.deleteBoolean = false;
            this.spinner.hide();

            this.ngAfterViewInit();
          })
          .catch((err) => {
            console.log(err.code);
            this.toast.error('Document not deleted!', err.code);
            this.spinner.hide();
          });
      })
      .catch((err: any) => {
        console.log(err.code);
        const dbinstance = doc(this.firestore, 'documents/' + data.id);

        deleteDoc(dbinstance)
          .then((res) => {
            this.toast.success('Document Deleted!', '', { timeOut: 1000 });
            this.deleteBoolean = false;
            this.spinner.hide();

            this.ngAfterViewInit();
          })
          .catch((err) => {
            console.log(err.code);
            this.toast.error('Document not deleted!', err.code);
          });
        this.ngAfterViewInit();

        this.toast.error('Document deleted!', err.code);
        this.spinner.hide();
      });
  }

  requestFile(id: any) {
    console.log(id);
    this.router.navigate(['/user-dashboard/request-document', id]);
  }

  goToFile(id: any) {
    this.router.navigate(['/user-dashboard/documents/view-document', id]);
  }
}
