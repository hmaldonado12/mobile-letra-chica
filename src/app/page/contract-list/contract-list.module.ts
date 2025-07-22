import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ContractListPageRoutingModule } from './contract-list-routing.module';
import { ContractListPage } from './contract-list.page';
import { AppFooterComponent } from 'src/app/components/app-footer/app-footer.component';
import { ThemeToggleComponent } from 'src/app/components/theme-toggle/theme-toggle.component';
import { UserInfoHeaderComponent } from 'src/app/components/user-info-header/user-info-header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContractListPageRoutingModule,
    ContractListPage,
    AppFooterComponent,
    ThemeToggleComponent,
    UserInfoHeaderComponent
  ]
})
export class ContractListPageModule {}
