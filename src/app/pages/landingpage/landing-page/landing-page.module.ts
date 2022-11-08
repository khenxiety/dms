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
import { AuthGuardService as AuthGuard } from 'src/app/services/auth/auth-guard.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { InstructionsComponent } from './components/instructions/instructions.component';
import { MarkdownModule } from 'ngx-markdown';

import 'prismjs';
import 'prismjs/components/prism-typescript.min.js';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'prismjs/plugins/line-highlight/prism-line-highlight.js';
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
        path: 'help',
        component: InstructionsComponent,
      },
      {
        path: 'about-us',
        component: AboutComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
        // canDeactivate: [AuthGuard],
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
    InstructionsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    UserDashboardModule,
    AdminDashboardModule,
    MatButtonModule,
    NgxSpinnerModule,
    MarkdownModule,
  ],
})
export class LandingPageModule {}
