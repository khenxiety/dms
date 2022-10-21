import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss'],
})
export class DashboardHeaderComponent implements OnInit {
  constructor(private authService: AuthServiceService) {}

  ngOnInit(): void {}

  signOut() {
    this.authService.logout();
  }
}
