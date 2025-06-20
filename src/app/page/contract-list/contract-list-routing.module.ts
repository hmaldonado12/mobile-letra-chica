import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContractListPage } from './contract-list.page';
import { ContractDetailPage } from '../contract-detail/contract-detail.page';

const routes: Routes = [
  { path: ':categoryId', component: ContractListPage },
  { path: ':categoryId/:id', component: ContractDetailPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractListPageRoutingModule {}
