import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bread-crumbs',
  templateUrl: './bread-crumbs.component.html',
  styleUrls: ['./bread-crumbs.component.scss'],
})
export class BreadCrumbsComponent implements OnInit {
  @Input() data: String = 'data';
  constructor() {}

  ngOnInit(): void {}
}
