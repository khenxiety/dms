import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDashboardComponent } from './user-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { DocumentTableComponent } from './components/tables/document-table/document-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
const routes: Routes = [
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    children: [
      {
        path: 'documents',
        component: DocumentsComponent,
      },
      {
        path: '',
        redirectTo: 'documents',
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
    UserDashboardComponent,
    DashboardHeaderComponent,
    DocumentsComponent,
    DocumentTableComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    MatProgressBarModule,
  ],
})
export class UserDashboardModule {}
