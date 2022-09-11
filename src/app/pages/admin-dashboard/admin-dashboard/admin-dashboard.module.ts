import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { NgChartsModule } from 'ng2-charts';
import { DocumentsComponent } from './components/documents/documents.component';
import { DocumentTableComponent } from './components/tables/document-table/document-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserTableComponent } from './components/tables/user-table/user-table.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { BreadCrumbsComponent } from './components/bread-crumbs/bread-crumbs.component';
import { LogsTableComponent } from './components/tables/logs-table/logs-table.component';
import { LogsComponent } from './components/logs/logs.component';
const routes: Routes = [
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'manage-documents',
        component: DocumentsComponent,
      },
      {
        path: 'manage-users',
        component: ManageUsersComponent,
      },
      {
        path: 'activity-logs',
        component: LogsComponent,
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },

  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  declarations: [
    AdminDashboardComponent,
    DashboardHeaderComponent,
    DashboardComponent,
    DocumentsComponent,
    DocumentTableComponent,
    UserTableComponent,
    ManageUsersComponent,
    BreadCrumbsComponent,
    LogsTableComponent,
    LogsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgChartsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class AdminDashboardModule {}
