import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  scrollUp: boolean = false;
  @HostListener('window:scroll', ['$event']) onscroll() {
    console.log('test');
    if (window.scrollY > 80) {
      this.scrollUp = true;
    } else {
      this.scrollUp = false;
    }
  }
  constructor() {}

  ngOnInit(): void {}

  toTop() {
    window.scroll({
      top: 0,
      left: 0,
    });
  }
}
