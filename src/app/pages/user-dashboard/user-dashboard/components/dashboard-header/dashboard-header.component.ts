import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AuthServiceService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss'],
})
export class DashboardHeaderComponent implements OnInit {
  @Input() headerName: string = '';
  @Input() isCollapsed: boolean = false;
  @Input() image: string = '';

  constructor(private authService: AuthServiceService) {}

  ngOnInit(): void {}

  signOut() {
    this.authService.logout();
  }
}
