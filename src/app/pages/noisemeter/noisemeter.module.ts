import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoisemeterPage } from './noisemeter.page';

import { NoisemeterPageRoutingModule } from './noisemeter-routing.module';

// Modules
import { ShareComponentsModule } from '../../modules/share-components/share-components.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    NoisemeterPageRoutingModule,
    ShareComponentsModule,
  ],
  declarations: [NoisemeterPage]
})
export class NoisemeterPageModule { }
