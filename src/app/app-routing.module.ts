import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./page/login/login-routing.module').then(m => m.LoginPageRoutingModule)
  },
  {
    path: 'launch-screen',
    loadChildren: () => import('./page/launch-screen/launch-screen.module').then(m => m.LaunchScreenPageModule)
  },
  // add other routes here as needed
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
