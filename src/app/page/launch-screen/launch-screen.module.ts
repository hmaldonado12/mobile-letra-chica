import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LaunchScreenPage } from './launch-screen.page';
import { LaunchScreenPageRoutingModule } from './launch-screen-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LaunchScreenPageRoutingModule
  ],
  declarations: [LaunchScreenPage],
})
export class LaunchScreenPageModule {}
