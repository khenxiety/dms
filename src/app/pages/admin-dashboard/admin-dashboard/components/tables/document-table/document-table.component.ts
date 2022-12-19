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
  orderBy,
} from '@angular/fire/firestore';
import { LogsService } from 'src/app/services/logs/logs.service';
import { SelectionModel } from '@angular/cdk/collections';
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
  @Input() currentUserCampus: string = '';
  @Input() currentUserId: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<DataItems>;
  dataSource: MatTableDataSource<DataItems>;
  selection = new SelectionModel<DataItems>(true, []);
  isSelected: boolean = false;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'select',
    'id',
    'name',
    'description',
    'classification',
    // 'file type',
    // 'user',
    // 'date',
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

  public formBuild: FormGroup = new FormGroup({});
  public updateForm: FormGroup = new FormGroup({});

  file!: File;

  dataItems: any;
  deleteBoolean: boolean = false;
  collapsed: boolean = false;

  selectedDocument: Array<any> = [];
  @ViewChild('closeUploadModal', { static: false }) closeUploadModal:
    | ElementRef
    | undefined;
  @ViewChild('deleteCloseModalAdmin', { static: false }) deleteCloseModalAdmin:
    | ElementRef
    | undefined;
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
      this.displayedColumns = [
        'select',
        // 'id',
        'name',
        // 'description',
        'classification',
        // 'file type',
        // 'user',
        // 'date',
        // 'campus',
        'action',
      ];
    } else {
      this.displayedColumns = [
        'select',
        'id',
        'name',
        'description',
        'classification',
        // 'file type',
        // 'user',
        // 'date',
        'campus',
        'action',
      ];
    }
  }
  ngAfterViewInit(): void {
    this.spinner.show();
    const dbinstance = collection(this.firestore, 'documents');
    const q = query(dbinstance, orderBy('dateAdded', 'desc'));
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
        console.log(err.message);
      });
  }

  ngOnInit(): void {
    this.buildForm();
  }
  searchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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

      // user: new FormControl(data.user || '', Validators.required),
      campus: new FormControl(data.campus || '', Validators.required),
    });
  }
  buildForm() {
    this.formBuild = new FormGroup({
      description: new FormControl('', Validators.required),
      file: new FormControl('', Validators.required),

      fileType: new FormControl('', Validators.required),

      classification: new FormControl('', Validators.required),

      campus: new FormControl('', Validators.required),
    });
  }

  fileChange(event: any) {
    console.log(event.target.files[0].type);
    if (this.fileRestriction.includes(event.target.files[0].type)) {
      this.file = event.target.files[0];
      this.isFileValid = true;
    } else {
      this.toast.error('Invalid file format');
      this.isFileValid = false;
    }
  }

  selectToDelete(row: any) {
    this.selectedDocument = row;
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
      this.toast.error('Please fill up all the fields');
      this.spinner.hide();

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
      uid: 'Admin',
      user: 'Admin',

      canAccess: [],
    };

    const dbinstance = collection(this.firestore, 'documents');
    addDoc(dbinstance, data)
      .then((res) => {
        this.logsService.addLogsService(
          'Added a Document',
          'Admin',
          'BatStateU',
          'Admin'
        );
        this.toast.success('Document Uploaded!', '', { timeOut: 1000 });
        this.closeUploadModal!.nativeElement.click();

        this.ngAfterViewInit();
        this.progress = 0;

        this.formBuild.reset();
        this.spinner.hide();
        // window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        this.toast.error(err.code);
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
    this.spinner.show();

    const storageRef = ref(this.storage, `documents/${data.file}`);

    deleteObject(storageRef)
      .then(() => {
        const dbinstance = doc(this.firestore, 'documents/' + data.id);

        deleteDoc(dbinstance)
          .then((res) => {
            this.toast.success('Document Deleted!', '', { timeOut: 1000 });
            this.deleteBoolean = false;
            this.spinner.hide();

            this.deleteCloseModalAdmin!.nativeElement.click();

            this.ngAfterViewInit();
          })
          .catch((err) => {
            console.log(err.message);
            this.spinner.hide();
            this.toast.error('Document not deleted!', err.message);
          });
      })
      .catch((err: any) => {
        console.log(err.message);
        const dbinstance = doc(this.firestore, 'documents/' + data.id);
        deleteDoc(dbinstance)
          .then((res) => {
            this.toast.success('Document Deleted!', '', { timeOut: 1000 });
            this.deleteBoolean = false;
            this.spinner.hide();

            this.deleteCloseModalAdmin!.nativeElement.click();

            this.ngAfterViewInit();
          })
          .catch((err) => {
            console.log(err.message);
            this.spinner.hide();
            this.toast.error('Document not deleted!', err.code);
          });
        this.spinner.hide();
        this.toast.error('Document not deleted!', err.code);
      });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;

    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row.id));
    if (this.selection.selected.length != 0) {
      this.isSelected = true;
      console.log('valid');
    } else {
      this.isSelected = false;

      console.log('not');
    }
    console.log(this.selection.selected);
  }
  singleSelection() {
    if (this.selection.selected.length != 0) {
      console.log('valid');
      this.isSelected = true;
    } else {
      console.log('not');
      this.isSelected = false;
    }
    console.log(this.selection.selected);
  }

  deleteDocuments() {
    const ids = this.selection.selected;
    this.spinner.show();

    ids.forEach((element) => {
      console.log(element);

      const filenames = this.dataItems.filter(
        (res: { id: any }) => res.id == element
      );
      console.log(filenames[0].fileName);
      const storageRef = ref(
        this.storage,
        `documents/${filenames[0].fileName}`
      );

      deleteObject(storageRef).then(() => {
        const dbinstance = doc(this.firestore, 'documents/' + element);

        deleteDoc(dbinstance)
          .then((res) => {
            this.toast.success('Document Deleted!', '', { timeOut: 1000 });
            this.deleteBoolean = false;

            this.ngAfterViewInit();
          })
          .catch((err) => {
            console.log(err);
            this.toast.success('Document not deleted!');
          });
      });
    });
  }

  goToFile(id: any) {
    this.router.navigate([
      '/admin-dashboard/manage-documents/view-document',
      id,
    ]);
  }
}
