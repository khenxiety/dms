import {
  AfterViewInit,
  Component,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {
  Auth,
  createUserWithEmailAndPassword,
  updateProfile,
  deleteUser,
} from '@angular/fire/auth';
import emailjs, { EmailJSResponseStatus, init } from '@emailjs/browser';
init('bLL2mnmGN5sMJJ-dH');
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
  arrayRemove,
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
import { LogsService } from 'src/app/services/logs/logs.service';
import { deleteDoc } from 'firebase/firestore';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { deleteObject } from '@angular/fire/storage';
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

  @ViewChild('remarksmodalclose') remarksmodalclose: ElementRef | undefined;

  dataSource: MatTableDataSource<DataItems>;
  selection = new SelectionModel<DataItems>(true, []);
  isSelected: boolean = false;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */

  displayedColumns = ['select', 'name', 'file', 'campus', 'status', 'action'];

  public usersForm: FormGroup = new FormGroup({});
  public updateForm: FormGroup = new FormGroup({});

  public remarks: string = '';

  dataItems: any;

  rightSideBarIsClosed: boolean = true;
  individualData: any = [];
  deleteBoolean: boolean = false;

  public selectedRow: any[] = [];
  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
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
        'name',
        // 'file',
        // 'campus',
        'status',
        'action',
      ];
    } else {
      this.displayedColumns = [
        'select',
        'name',
        'file',
        'campus',
        'status',
        'action',
      ];
    }
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

    this.getPendingRequests();
  }
  ngOnInit(): void {
    this.buildForm();
  }

  getPendingRequests() {
    const dbinstance = collection(this.firestore, 'requests');

    const q = query(dbinstance, orderBy('date', 'desc'));

    getDocs(q)
      .then((res: any) => {
        let pendingRequests = [
          ...res.docs.map((doc: any) => {
            return { id: doc.id, ...doc.data() };
          }),
        ];

        this.spinner.hide();

        pendingRequests.map((res) => {
          console.log(new Date(res.date).getDate(), new Date().getDate());

          // if(new Date(res.date).getDate()+7 >=31){

          // }
          console.log(res.expiration);
          if (
            res.expiration == new Date().toLocaleDateString() &&
            res.status == 'rejected'
          ) {
            const deleteRequest = doc(this.firestore, 'requests/' + res.id);

            deleteDoc(deleteRequest)
              .then((res) => {
                console.log('Request expired');

                this.toastr.info('Request Expired');
                this.ngAfterViewInit();
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
  searchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openRightSideBar(data: any) {
    this.individualData = data;
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
        this.toastr.success('Request Approved');
        this.ngAfterViewInit();
        this.ngOnInit();

        // this.formBuild.reset();
      })
      .catch((err: any) => {
        console.log(err.message);
      });
  }

  addAccess(fileId: any, row: any) {
    let data = {
      canAccess: arrayUnion({
        accessId: row.uid,
        accessEmail: row.requesterName,
      }),
    };
    const updatedoc = doc(this.firestore, 'documents', fileId);
    updateDoc(updatedoc, data)
      .then((res: any) => {
        this.updateStatus(row);
        let email = {
          to_email: row.requesterName,
          status: 'approved',

          message: `Your request to a document ${row.fileRequested} has been approved `,
        };
        emailjs
          .send(
            'service_hp4emrd',
            'template_uremtz9',
            email,
            'bLL2mnmGN5sMJJ-dH'
          )
          .then((res: EmailJSResponseStatus) => {
            console.log(res.text);
          });

        this.spinner.hide();
        this.closeRightSideBar();
        this.logsService.addLogsService(
          `Updated Access `,
          'Admin',
          'Admin',
          'Admin'
        );
        this.ngAfterViewInit();
        this.ngOnInit();

        // this.formBuild.reset();
      })
      .catch((err: any) => {
        console.log(err.message);
      });
    this.ngOnInit();
  }

  selectRow(row: any): void {
    this.selectedRow = row;
  }

  deleteRequest(row: any) {
    const dbInstance = doc(this.firestore, 'requests/' + row.id);
    let data = {
      status: 'rejected',
      expiration: new Date(
        new Date().setDate(new Date().getDate() + 3)
      ).toLocaleDateString(),
    };
    let email = {
      to_email: row.requesterName,
      status: 'rejected',

      message: `Your request to a document ${row.fileRequested} was rejected for a reason of ${this.remarks}`,
    };

    updateDoc(dbInstance, data)
      .then((res) => {
        emailjs
          .send(
            'service_hp4emrd',
            'template_uremtz9',
            email,
            'bLL2mnmGN5sMJJ-dH'
          )
          .then((res: EmailJSResponseStatus) => {
            console.log(res.text);
          });
        this.remarksmodalclose?.nativeElement.click();

        this.spinner.hide();
        this.ngAfterViewInit();
        this.ngOnInit();
        this.toastr.success(
          'An email has been sent to the requester',
          'Request rejected successfully'
        );
      })
      .catch((err) => {
        console.log(err.message);
      });
    // deleteDoc(dbInstance)
    //   .then((res: any) => {
    //     console.log(res);
    //     this.ngAfterViewInit();
    //   })
    //   .catch((err: any) => {
    //     console.log(err);
    //   });
  }

  removeRequest(data: any) {}

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;

    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row: any) =>
          this.selection.select(row.id)
        );
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

  deleteRequests() {
    const ids = this.selection.selected;
    this.spinner.show();

    ids.forEach((element) => {
      console.log(element);

      const dbinstance = doc(this.firestore, 'requests/' + element);

      deleteDoc(dbinstance)
        .then((res) => {
          this.deleteBoolean = false;

          this.ngAfterViewInit();
        })
        .catch((err) => {
          console.log(err);
          this.toastr.success('Requests not deleted!');
        });
    });

    setTimeout(() => {
      this.toastr.success('Requests Deleted!', '', { timeOut: 2000 });
    }, 1000);
  }
}
