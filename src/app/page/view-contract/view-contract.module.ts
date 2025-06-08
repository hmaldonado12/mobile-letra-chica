import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewContractPageRoutingModule } from './view-contract-routing.module';

import { ViewContractPage } from './view-contract.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewContractPageRoutingModule,
    ViewContractPage
  ],
  declarations: []
})
export class ViewContractPageModule {}
