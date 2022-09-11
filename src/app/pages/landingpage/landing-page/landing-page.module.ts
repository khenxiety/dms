import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './components/footer/footer.component';
import { UserDashboardModule } from '../../user-dashboard/user-dashboard/user-dashboard.module';
import { AdminDashboardModule } from '../../admin-dashboard/admin-dashboard/admin-dashboard.module';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    children: [
      {
        path: 'hero',
        component: HeroComponent,
      },
      {
        path: 'about-us',
        component: AboutComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'administrator',
        component: AdminLoginComponent,
      },
      {
        path: '',
        redirectTo: 'hero',
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
    LandingPageComponent,
    HeaderComponent,
    HeroComponent,
    AboutComponent,
    LoginComponent,
    FooterComponent,
    AdminLoginComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    UserDashboardModule,
    AdminDashboardModule,
    MatButtonModule,
  ],
})
export class LandingPageModule {}