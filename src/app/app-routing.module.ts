import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { LaunchScreenPage } from './page/launch-screen/launch-screen.page';
import { LoginPage } from './page/login/login.page';
import { HomePage } from './page/home/home.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'launch-screen',
    pathMatch: 'full'
  },
  {
    path: 'launch-screen',
    loadComponent: () => import('./page/launch-screen/launch-screen.page').then(m => m.LaunchScreenPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./page/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./page/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'contracts',
    loadChildren: () => import('./page/contracts/contracts.module').then( m => m.ContractsPageModule)
  },
  {
    path: "new-contract",
    loadChildren: () => import('./page/new-contract/new-contract.module').then(m => m.NewContractPageModule)
  },
  {
    path: 'view-contract',
    loadChildren: () => import('./page/view-contract/view-contract.module').then( m => m.ViewContractPageModule)
  },
  {
    path: 'contract-list',
    loadChildren: () => import('./page/contract-list/contract-list.module').then(m => m.ContractListPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
