import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoisemeterPage } from './noisemeter.page';

const routes: Routes = [
  {
    path: '',
    component: NoisemeterPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoisemeterPageRoutingModule {}
