import {
  AfterViewInit,
  Component,
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

  addNewUser() {
    if (this.usersForm.valid) {
      console.log(this.usersForm.value);
      this.signUp();
    } else {
      this.usersForm.markAllAsTouched();
    }
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
      console.log(err);
    });

    let data = {
      fullName: this.usersForm.value.fullName,
      idNumber: this.usersForm.value.idNumber,
      campus: this.usersForm.value.campus,
      email: this.usersForm.value.email,
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

        this.ngAfterViewInit();
      })
      .catch((err) => {
        console.log(err);
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
      });
  }
}
