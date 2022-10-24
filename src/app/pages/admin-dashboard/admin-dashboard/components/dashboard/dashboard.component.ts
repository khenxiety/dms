import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import {
  collection,
  addDoc,
  Firestore,
  getDocs,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  users: any = [];
  documents: any = [];
  requests: any = [];
  dataJanuary: Array<any> = [];
  dataFeb: Array<any> = [];

  dataMarch: Array<any> = [];

  dataApril: Array<any> = [];

  dataMay: Array<any> = [];

  dataJune: Array<any> = [];

  dataJuly: Array<any> = [];

  dataAug: Array<any> = [];

  dataSept: Array<any> = [];

  dataOct: Array<any> = [];

  dataNov: Array<any> = [];

  dataDec: Array<any> = [];
  perYear: Array<any> = [];

  dataSetPie: Array<any> = [];
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        data: this.perYear,
        label: 'Number of Uploaded Documents Per Year',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(25, 135, 84,0.3)',
      },
    ],
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
  };
  public lineChartLegend = true;

  // Pie
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
  };
  public pieChartLabels = [['Users'], ['Documents'], 'Requests'];
  public pieChartDatasets = [
    {
      data: this.dataSetPie,
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
        this.dataSetPie.push(this.users.length);
        this.chart?.update();
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

        this.dataSetPie.push(this.documents.length);
        this.spinner.hide();
      })
      .catch((err: any) => {
        console.log(err.message);
      });
    const date = new Date();
    const january = query(
      dbinstance,
      where('dateAdded', '>=', `${date.getFullYear()}-01-01T00:00:00.000Z`),
      where('dateAdded', '<=', `${date.getFullYear()}-01-31T00:00:00.000Z`)
    );
    getDocs(january)
      .then((res: any) => {
        this.dataJanuary = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];

        this.perYear.push(this.dataJanuary.length);

        this.spinner.hide();
      })
      .catch((err: any) => {
        console.log(err.message);
      });
    const feb = query(
      dbinstance,
      where('dateAdded', '>=', `${date.getFullYear()}-02-01T00:00:00.000Z`),
      where('dateAdded', '<=', `${date.getFullYear()}-02-28T00:00:00.000Z`)
    );
    getDocs(feb)
      .then((res: any) => {
        this.dataFeb = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
        this.perYear.push(this.dataFeb.length);

        this.spinner.hide();
      })
      .catch((err: any) => {
        console.log(err.message);
      });
    const march = query(
      dbinstance,
      where('dateAdded', '>=', `${date.getFullYear()}-03-01T00:00:00.000Z`),
      where('dateAdded', '<=', `${date.getFullYear()}-03-31T00:00:00.000Z`)
    );
    getDocs(march)
      .then((res: any) => {
        this.dataMarch = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
        this.perYear.push(this.dataMarch.length);

        this.spinner.hide();
      })
      .catch((err: any) => {
        console.log(err.message);
      });
    const april = query(
      dbinstance,
      where('dateAdded', '>=', `${date.getFullYear()}-04-01T00:00:00.000Z`),
      where('dateAdded', '<=', `${date.getFullYear()}-04-30T00:00:00.000Z`)
    );
    getDocs(april)
      .then((res: any) => {
        this.dataApril = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
        this.perYear.push(this.dataApril.length);

        this.spinner.hide();
      })
      .catch((err: any) => {
        console.log(err.message);
      });
    const may = query(
      dbinstance,
      where('dateAdded', '>=', `${date.getFullYear()}-05-01T00:00:00.000Z`),
      where('dateAdded', '<=', `${date.getFullYear()}-05-31T00:00:00.000Z`)
    );
    getDocs(may)
      .then((res: any) => {
        this.dataMay = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
        this.perYear.push(this.dataMay.length);

        this.spinner.hide();
      })
      .catch((err: any) => {
        console.log(err.message);
      });
    const june = query(
      dbinstance,
      where('dateAdded', '>=', `${date.getFullYear()}-06-01T00:00:00.000Z`),
      where('dateAdded', '<=', `${date.getFullYear()}-06-30T00:00:00.000Z`)
    );
    getDocs(june)
      .then((res: any) => {
        this.dataJune = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
        this.perYear.push(this.dataJune.length);

        this.spinner.hide();
      })
      .catch((err: any) => {
        console.log(err.message);
      });
    const july = query(
      dbinstance,
      where('dateAdded', '>=', `${date.getFullYear()}-07-01T00:00:00.000Z`),
      where('dateAdded', '<=', `${date.getFullYear()}-07-31T00:00:00.000Z`)
    );
    getDocs(july)
      .then((res: any) => {
        this.dataJuly = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
        this.perYear.push(this.dataJuly.length);

        this.spinner.hide();
      })
      .catch((err: any) => {
        console.log(err.message);
      });
    const aug = query(
      dbinstance,
      where('dateAdded', '>=', `${date.getFullYear()}-08-01T00:00:00.000Z`),
      where('dateAdded', '<=', `${date.getFullYear()}-08-31T00:00:00.000Z`)
    );
    getDocs(aug)
      .then((res: any) => {
        this.dataAug = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
        this.perYear.push(this.dataAug.length);

        this.spinner.hide();
      })
      .catch((err: any) => {
        console.log(err.message);
      });
    const sept = query(
      dbinstance,
      where('dateAdded', '>=', `${date.getFullYear()}-09-01T00:00:00.000Z`),
      where('dateAdded', '<=', `${date.getFullYear()}-09-30T00:00:00.000Z`)
    );
    getDocs(sept)
      .then((res: any) => {
        this.dataSept = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
        this.perYear.push(this.dataSept.length);

        this.spinner.hide();
      })
      .catch((err: any) => {
        console.log(err.message);
      });
    const oct = query(
      dbinstance,
      where('dateAdded', '>=', `${date.getFullYear()}-10-01T00:00:00.000Z`),
      where('dateAdded', '<=', `${date.getFullYear()}-10-31T00:00:00.000Z`)
    );
    getDocs(oct)
      .then((res: any) => {
        this.dataOct = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
        this.perYear.push(this.dataOct.length);

        this.spinner.hide();
      })
      .catch((err: any) => {
        console.log(err.message);
      });
    const nov = query(
      dbinstance,
      where('dateAdded', '>=', `${date.getFullYear()}-11-01T00:00:00.000Z`),
      where('dateAdded', '<=', `${date.getFullYear()}-11-30T00:00:00.000Z`)
    );
    getDocs(nov)
      .then((res: any) => {
        this.dataNov = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
        this.perYear.push(this.dataNov.length);

        this.spinner.hide();
      })
      .catch((err: any) => {
        console.log(err.message);
      });
    const dec = query(
      dbinstance,
      where('dateAdded', '>=', `${date.getFullYear()}-12-01T00:00:00.000Z`),
      where('dateAdded', '<=', `${date.getFullYear()}-12-31T00:00:00.000Z`)
    );
    getDocs(dec)
      .then((res: any) => {
        this.dataDec = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
        this.perYear.push(this.dataDec.length);
        this.chart?.update();
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
        this.dataSetPie.push(this.requests.length);

        console.log(this.pieChartDatasets);

        this.chart?.update();
        this.spinner.hide();
      })
      .catch((err: any) => {
        console.log(err.message);
      });
  }
}
