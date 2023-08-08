import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { LivelliComponent } from '../../components/livelli/livelli.component';
import { GraficiComponent } from '../../components/grafici/grafici.component';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    LivelliComponent,
    GraficiComponent
  ],
  imports: [
    CommonModule,
    PlotlyModule
  ],
  exports: [
    LivelliComponent,
    GraficiComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ShareComponentsModule { }
