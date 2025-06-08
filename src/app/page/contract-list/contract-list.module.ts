import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ContractListPageRoutingModule } from './contract-list-routing.module';
import { ContractListPage } from './contract-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContractListPageRoutingModule,
    ContractListPage
  ]
})
export class ContractListPageModule {}
