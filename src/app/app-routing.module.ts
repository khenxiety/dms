import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageModule } from './pages/landingpage/landing-page/landing-page.module';
const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/landingpage/landing-page/landing-page.module').then(
        (module) => module.LandingPageModule
      ),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
