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
import { AuthGuardService as AuthGuard } from 'src/app/services/auth/auth-guard.service';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { RequestsComponent } from './components/requests/requests.component';
import { BreadCrumbsComponent } from './components/bread-crumbs/bread-crumbs.component';
import { AdministrationComponent } from './components/administration/administration.component';
import { AdministrativeStaffComponent } from './components/administrative-staff/administrative-staff.component';
import { CdopComponent } from './components/cdop/cdop.component';
import { ServicesUtilizationComponent } from './components/services-utilization/services-utilization.component';
import { PsufComponent } from './components/psuf/psuf.component';
import { FinancialSupportComponent } from './components/financial-support/financial-support.component';
import { LinkagesComponent } from './components/linkages/linkages.component';
import { IsoComponent } from './components/iso/iso.component';
import { OtherDocumentsComponent } from './components/other-documents/other-documents.component';
import { ViewDocumentComponent } from './components/view-document/view-document.component';

const routes: Routes = [
  {
    path: 'user-dashboard',
    canActivate: [AuthGuard],
    component: UserDashboardComponent,
    children: [
      {
        path: 'documents',
        component: DocumentsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'administration',
        component: AdministrationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'administrative-staff',
        component: AdministrativeStaffComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'cdop',
        component: CdopComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'services-utilization',
        component: ServicesUtilizationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'psuf',
        component: PsufComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'financial-support',
        component: FinancialSupportComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'linkages',
        component: LinkagesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'iso-documents',
        component: IsoComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'other-documents',
        component: OtherDocumentsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'request-document',
        component: RequestsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'request-document/:id',
        component: RequestsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'documents/view-document/:id',
        component: ViewDocumentComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'user-profile',
        component: UserProfileComponent,
        canActivate: [AuthGuard],
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
    UserProfileComponent,
    RequestsComponent,
    BreadCrumbsComponent,
    AdministrationComponent,
    AdministrativeStaffComponent,
    CdopComponent,
    ServicesUtilizationComponent,
    PsufComponent,
    FinancialSupportComponent,
    LinkagesComponent,
    IsoComponent,
    OtherDocumentsComponent,
    ViewDocumentComponent,
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
