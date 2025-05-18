import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./page/launch-screen/launch-screen.module').then(m => m.LaunchScreenPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./page/login/login-routing.module').then(m => m.LoginPageRoutingModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
