import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapPageRoutingModule } from './map-routing.module';

import { MapPage } from './map.page';

import { ShareComponentsModule } from 'src/app/modules/share-components/share-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapPageRoutingModule,
    ShareComponentsModule
  ],
  declarations: [MapPage]
})
export class MapPageModule {}
