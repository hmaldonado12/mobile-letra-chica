import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LaunchScreenPage } from './launch-screen.page';

const routes: Routes = [
  {
    path: '',
    component: LaunchScreenPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LaunchScreenPageRoutingModule {}