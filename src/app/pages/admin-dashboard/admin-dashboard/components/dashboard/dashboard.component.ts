import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import {
  collection,
  addDoc,
  Firestore,
  getDocs,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  users: any = [];
  documents: any = [];
  requests: any = [];

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Number of Uploaded Documents',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(25, 135, 84,0.3)',
      },
    ],
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false,
  };
  public lineChartLegend = true;

  // Pie
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  public pieChartLabels = [
    ['Download', 'Sales'],
    ['In', 'Store', 'Sales'],
    'Mail Sales',
  ];
  public pieChartDatasets = [
    {
      data: [300, 500, 100],
    },
  ];
  public pieChartLegend = true;
  public pieChartPlugins = [];
  constructor(
    private spinner: NgxSpinnerService,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.getDocuments();
    this.getRequests();

    // const test = [
    //   {
    //     cat: '1',
    //   },
    //   {
    //     cat: '1',
    //   },
    //   {
    //     cat: '1',
    //   },
    //   {
    //     cat: '2',
    //   },
    //   {
    //     cat: '3',
    //   },
    // ];

    // const arr: any = [];

    // test.forEach((element) => {
    //   console.log(element.cat);
    //   if (!arr.includes(element.cat)) {
    //     arr.push(element.cat);
    //   }
    // });

    // console.log(arr);
  }

  getUsers() {
    this.spinner.show();

    const dbinstance = collection(this.firestore, 'users');
    const q = query(dbinstance, orderBy('fullName', 'asc'));

    getDocs(q)
      .then((res: any) => {
        this.users = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];

        this.spinner.hide();
      })
      .catch((err: any) => {
        console.log(err.message);
      });
  }
  getDocuments() {
    const dbinstance = collection(this.firestore, 'documents');

    getDocs(dbinstance)
      .then((res: any) => {
        this.documents = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];

        this.spinner.hide();
      })
      .catch((err: any) => {
        console.log(err.message);
      });
  }
  getRequests() {
    const dbinstance = collection(this.firestore, 'requests');

    getDocs(dbinstance)
      .then((res: any) => {
        this.requests = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];

        this.spinner.hide();
      })
      .catch((err: any) => {
        console.log(err.message);
      });
  }
}
