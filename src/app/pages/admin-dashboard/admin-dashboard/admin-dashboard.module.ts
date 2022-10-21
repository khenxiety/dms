import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { NgxSpinnerModule } from 'ngx-spinner';

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
import { AuthGuardService as AuthGuard } from 'src/app/services/auth/auth-guard.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ManageRequestsComponent } from './components/manage-requests/manage-requests.component';
import { RequestsTableComponent } from './components/tables/requests-table/requests-table.component';
import { ViewDocumentComponent } from './components/view-document/view-document.component';
const routes: Routes = [
  {
    path: 'admin-dashboard',
    canActivate: [AuthGuard],
    component: AdminDashboardComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'manage-documents',
        component: DocumentsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'manage-requests',
        component: ManageRequestsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'manage-users',
        component: ManageUsersComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'activity-logs',
        component: LogsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'manage-documents/view-document/:id',
        component: ViewDocumentComponent,
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
    ManageRequestsComponent,
    RequestsTableComponent,
    ViewDocumentComponent,
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
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    MatProgressBarModule,
    MatCheckboxModule,
  ],
})
export class AdminDashboardModule {}
