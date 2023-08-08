import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SaveddataPageRoutingModule } from './saveddata-routing.module';

import { SaveddataPage } from './saveddata.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SaveddataPageRoutingModule
  ],
  declarations: [SaveddataPage]
})
export class SaveddataPageModule {}
