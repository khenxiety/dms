import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
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
  arrayUnion,
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
import { deleteDoc } from 'firebase/firestore';

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
  selector: 'app-requests-table',
  templateUrl: './requests-table.component.html',
  styleUrls: ['./requests-table.component.scss'],
})
export class RequestsTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<DataItems>;
  dataSource: MatTableDataSource<DataItems>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */

  displayedColumns = ['name', 'file', 'campus', 'status', 'action'];

  public usersForm: FormGroup = new FormGroup({});
  public updateForm: FormGroup = new FormGroup({});

  dataItems: any;

  rightSideBarIsClosed: boolean = true;
  individualData: any = [];

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private logsService: LogsService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit(): void {
    this.spinner.show();
    this.individualData = [];
    const dbinstance = collection(this.firestore, 'requests');
    const q = query(dbinstance, orderBy('date', 'desc'));

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
  searchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openRightSideBar(data: any) {
    this.individualData = data;
    console.log(this.individualData);
    this.rightSideBarIsClosed = this.rightSideBarIsClosed ? false : true;
  }

  closeRightSideBar() {
    this.individualData = undefined;

    this.rightSideBarIsClosed = true;
  }
  buildForm() {
    this.usersForm = new FormGroup({
      idNumber: new FormControl('', Validators.required),
      fullName: new FormControl('', Validators.required),

      campus: new FormControl('', Validators.required),

      email: new FormControl('', Validators.required),

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

  updateStatus(row: any) {
    let data = {
      status: 'approved',
    };
    const updatedoc = doc(this.firestore, 'requests', row.id);
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

  addAccess(fileId: any, row: any) {
    let data = {
      canAccess: arrayUnion(row.uid),
    };
    const updatedoc = doc(this.firestore, 'documents', fileId);
    updateDoc(updatedoc, data)
      .then((res: any) => {
        this.updateStatus(row);
        console.log(res);
        this.spinner.hide();
        this.closeRightSideBar();
        this.logsService.addLogsService(
          `Updated Access `,
          'Admin',
          'Admin',
          'Admin'
        );
        this.ngAfterViewInit();

        // this.formBuild.reset();
      })
      .catch((err: any) => {
        console.log(err.message);
      });
  }

  deleteRequest(id: any) {
    const dbInstance = doc(this.firestore, 'requests/' + id);
    deleteDoc(dbInstance)
      .then((res: any) => {
        console.log(res);
        this.ngAfterViewInit();
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
}
