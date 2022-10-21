import {
  AfterViewInit,
  Component,
  HostListener,
  ViewChild,
} from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  collection,
  Firestore,
  getDocs,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LogsTableDataSource, LogsTableItem } from './logs-table-datasource';
import * as XLSX from 'xlsx';

export interface DataItems {
  idNumber: any;
  userName: any;
  date: any;
  activity: any;

  campus: any;
}
@Component({
  selector: 'app-logs-table',
  templateUrl: './logs-table.component.html',
  styleUrls: ['./logs-table.component.scss'],
})
export class LogsTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<DataItems>;
  dataSource: MatTableDataSource<DataItems>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'username', 'campus', 'date', 'activity'];

  dataItems: any = [];
  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.dataSource = new MatTableDataSource();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth <= 1100) {
      this.displayedColumns = [
        // 'id',
        'username',
        // 'campus',
        'date',
        'activity',
      ];
    } else {
      this.displayedColumns = ['id', 'username', 'campus', 'date', 'activity'];
    }
  }

  ngAfterViewInit(): void {
    this.spinner.show();
    const dbinstance = collection(this.firestore, 'logs');
    // const q = query( orderBy("timeCreated","desc"));
    const q = query(dbinstance, orderBy('timeCreated', 'asc'));
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

  exportexcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'DMS-Logs.xlsx');

    // location.reload();
  }
  searchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
