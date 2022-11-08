import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { UserTableDataSource, UserTableItem } from './user-table-datasource';
import {
  Auth,
  createUserWithEmailAndPassword,
  updateProfile,
  deleteUser,
} from '@angular/fire/auth';

import {
  collection,
  addDoc,
  Firestore,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc,
  deleteDoc,
} from '@angular/fire/firestore';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { NgxSpinnerService, Spinner } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LogsService } from 'src/app/services/logs/logs.service';

export interface DataItems {
  idNumber: any;
  fullName: any;
  file: any;
  email: any;

  campus: any;
  password: any;
  status: any;
  action: any;
}

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<DataItems>;
  dataSource: MatTableDataSource<DataItems>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */

  displayedColumns = [
    'id',
    'name',
    'file',
    'description',
    'classification',
    'status',

    'action',
  ];

  public usersForm: FormGroup = new FormGroup({});
  public updateForm: FormGroup = new FormGroup({});

  dataItems: any;

  otherCampus: boolean = false;
  selectedUser: any = '';

  @ViewChild('userModalClose', { static: false }) userModalClose:
    | ElementRef
    | undefined;
  @ViewChild('userUpdateModalClose', { static: false }) userUpdateModalClose:
    | ElementRef
    | undefined;

  @ViewChild('deleteUserModalClose', { static: false }) deleteUserModalClose:
    | ElementRef
    | undefined;

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
  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private logsService: LogsService
  ) {
    this.dataSource = new MatTableDataSource();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth <= 1100) {
      this.displayedColumns = [
        'id',
        // 'name',
        // 'file',
        'description',
        // 'classification',
        'status',

        'action',
      ];
    } else {
      this.displayedColumns = [
        'id',
        'name',
        'file',
        'description',
        'classification',
        'status',

        'action',
      ];
    }
  }

  ngAfterViewInit(): void {
    this.spinner.show();
    const dbinstance = collection(this.firestore, 'users');
    const q = query(dbinstance, orderBy('fullName', 'asc'));

    getDocs(q)
      .then((res: any) => {
        this.dataItems = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
        this.buildUpdateForm(this.dataItems);

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
  showPassword(password: any) {
    password.type = password.type === 'password' ? 'text' : 'password';
  }
  buildForm() {
    this.usersForm = new FormGroup({
      idNumber: new FormControl('', Validators.required),
      fullName: new FormControl('', Validators.required),

      campus: new FormControl('', Validators.required),

      email: new FormControl('', [Validators.required, Validators.email]),
      type: new FormControl('', [Validators.required]),

      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
    this.updateForm = new FormGroup({
      idNumber: new FormControl('', Validators.required),
      fullName: new FormControl('', Validators.required),

      campus: new FormControl('', Validators.required),

      email: new FormControl('', [Validators.required, Validators.email]),
      type: new FormControl('', [Validators.required]),

      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }
  buildUpdateForm(data: any) {
    this.updateForm = new FormGroup({
      idNumber: new FormControl(data.idNumber || '', Validators.required),
      fullName: new FormControl(data.fullName || '', Validators.required),
      campus: new FormControl(data.campus || '', Validators.required),
      email: new FormControl(data.email || '', Validators.required),
      username: new FormControl(data.username || '', Validators.required),
      type: new FormControl(data.type || '', [Validators.required]),

      status: new FormControl(data.status || '', Validators.required),
    });
  }
  searchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectCampus() {
    if (this.usersForm.value.campus == 'others') {
      this.otherCampus = true;
    } else {
      this.otherCampus = false;
    }
  }
  addNewUser() {
    if (this.usersForm.valid) {
      this.signUp();
    } else {
      this.usersForm.markAllAsTouched();
    }
  }

  selectIndividualId(id: any) {
    this.selectedUser = id;
  }
  selectUserData(data: any) {
    this.selectIndividualId(data.id);
    this.updateForm = new FormGroup({
      idNumber: new FormControl(data.idNumber, Validators.required),
      fullName: new FormControl(data.fullName, Validators.required),
      campus: new FormControl(data.campus, Validators.required),
      email: new FormControl(data.email, Validators.required),
      type: new FormControl(data.type || '', [Validators.required]),
      username: new FormControl(data.username, Validators.required),
      status: new FormControl(data.status, Validators.required),
      uid: new FormControl(data.uid, Validators.required),
    });
  }

  async signUp() {
    const dbinstance = collection(this.firestore, 'users');

    const createUser = await createUserWithEmailAndPassword(
      this.auth,
      this.usersForm.value.email,
      this.usersForm.value.password
    );

    updateProfile(createUser.user, {
      displayName: this.usersForm.value.fullName,
    }).catch((err) => {
      this.toastr.error(err.message);
      this.ngAfterViewInit();
      this.spinner.hide();
    });

    let data = {
      fullName: this.usersForm.value.fullName,
      idNumber: this.usersForm.value.idNumber,
      campus: this.usersForm.value.campus,
      email: this.usersForm.value.email,
      type: this.usersForm.value.type,
      password: this.usersForm.value.password,
      uid: createUser.user.uid,
      username: this.usersForm.value.username,
      status: 'pending',
      displayPicture: '',
      address: '',
      mobile: '',
    };

    addDoc(dbinstance, data)
      .then((res) => {
        this.toastr.success('User added successfully');
        const date = new Date();

        this.logsService.addLogsService(
          `Added a User (${data.username})`,
          'Admin',
          `${data.campus}`,
          'admin'
        );

        this.userModalClose?.nativeElement.click();
        this.usersForm.reset();

        this.ngAfterViewInit();
      })
      .catch((err) => {
        this.toastr.error(err.message);
        this.ngAfterViewInit();
        this.spinner.hide();
      });
  }

  updateStatus(event: any, row: any) {
    let data = {
      status: event,
    };
    const updatedoc = doc(this.firestore, 'users', row.id);
    updateDoc(updatedoc, data)
      .then((res: any) => {
        this.spinner.hide();
        this.logsService.addLogsService(
          `Updated status (${row.username},${event})`,
          'Admin',
          'Admin',
          'Admin'
        );
        this.toastr.success('Information updated successfully');
        this.ngAfterViewInit();

        // this.formBuild.reset();
      })
      .catch((err: any) => {
        console.log(err.message);
        this.toastr.error(err.message);
        this.ngAfterViewInit();
        this.spinner.hide();
      });
  }

  updateUser() {
    this.spinner.show();
    const updateUser = doc(this.firestore, 'users', this.selectedUser);
    let data = {
      fullName: this.updateForm.value.fullName,
      idNumber: this.updateForm.value.idNumber,
      campus: this.updateForm.value.campus,
      email: this.updateForm.value.email,
      type: this.updateForm.value.type,
      username: this.updateForm.value.username,
      status: this.updateForm.value.status,
    };
    updateDoc(updateUser, data)
      .then((res: any) => {
        this.logsService.addLogsService(
          `Updated Information (${data.username},${data.idNumber})`,
          'Admin',
          'Admin',
          'Admin'
        );

        this.selectedUser = '';

        this.userUpdateModalClose?.nativeElement.click();
        this.updateForm.reset();
        this.toastr.success('Information updated successfully');
        this.ngAfterViewInit();
        this.spinner.hide();
      })
      .catch((err: any) => {
        this.selectedUser = '';

        this.updateForm.reset();
        this.toastr.error(err.message);
        this.ngAfterViewInit();
        this.spinner.hide();
      });
  }

  deleteUser(id: any) {
    const deleteInstance = doc(this.firestore, 'users/' + id);
    deleteDoc(deleteInstance)
      .then((res: any) => {
        this.selectedUser = '';

        this.deleteUserModalClose?.nativeElement.click();
        this.updateForm.reset();
        this.toastr.success('User deleted successfully');
        this.ngAfterViewInit();
        this.spinner.hide();
      })
      .catch((err: any) => {
        this.selectedUser = '';
        this.toastr.error(err.message);
        this.ngAfterViewInit();
        this.spinner.hide();
      });
  }
}
