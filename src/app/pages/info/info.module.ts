import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfoPage } from './info.page';

import { PdfViewerModule } from 'ng2-pdf-viewer';

import { InfoPageRoutingModule } from './info-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    InfoPageRoutingModule,
    PdfViewerModule
  ],
  declarations: [InfoPage]
})
export class InfoPageModule {}
