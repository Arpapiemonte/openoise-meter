import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SaveddataPage } from './saveddata.page';

const routes: Routes = [
  {
    path: '',
    component: SaveddataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SaveddataPageRoutingModule {}
