import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewContractPageRoutingModule } from './new-contract-routing.module';

import { NewContractPage } from './new-contract.page';
import { AppFooterComponent } from 'src/app/components/app-footer/app-footer.component';
import { ThemeToggleComponent } from 'src/app/components/theme-toggle/theme-toggle.component';
import { UserInfoHeaderComponent } from 'src/app/components/user-info-header/user-info-header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewContractPageRoutingModule,
    NewContractPage,
    AppFooterComponent,
    ThemeToggleComponent,
    UserInfoHeaderComponent
  ]
})
export class NewContractPageModule {}
