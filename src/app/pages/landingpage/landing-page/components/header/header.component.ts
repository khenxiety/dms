import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  openMenu: boolean = false;
  constructor() {}

  ngOnInit(): void {
    window.scroll({
      top: 0,
    });
  }

  toggleMenu() {
    this.openMenu = this.openMenu ? false : true;
  }

  close() {
    this.openMenu = false;
  }
}
