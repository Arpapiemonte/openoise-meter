import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { LivelliComponent } from '../../components/livelli/livelli.component';
import { GraficiComponent } from '../../components/grafici/grafici.component';
import { MappaBaseComponent } from 'src/app/components/mappa-base/mappa-base.component';
import { LegendaComponent } from 'src/app/components/legenda/legenda.component';
import { ModalComponent } from 'src/app/components/modal/modal.component';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    LivelliComponent,
    GraficiComponent,
    MappaBaseComponent,
    LegendaComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    PlotlyModule
  ],
  exports: [
    LivelliComponent,
    GraficiComponent,
    MappaBaseComponent,
    LegendaComponent,
    ModalComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ShareComponentsModule { }
