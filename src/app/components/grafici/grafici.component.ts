import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { 
  IonCard,
  IonCol,
  IonLabel,
  IonRow,
  IonSegment,
  IonSegmentButton,
} from '@ionic/angular/standalone';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';

PlotlyModule.plotlyjs = PlotlyJS;

import { GraficiService } from '../../services/grafici.service';
import { VariabiliService } from 'src/app/services/variabili.service';

@Component({
  selector: 'app-grafici',
  templateUrl: './grafici.component.html',
  styleUrls: ['./grafici.component.scss'],
  imports: [
    IonCard,
    IonCol,
    IonLabel,
    IonRow,
    IonSegment,
    IonSegmentButton,
    CommonModule,
    PlotlyModule
  ]
})
export class GraficiComponent  implements OnInit {


  visualizzaGrafico = 'chartLAeqTimeRunning'

  constructor(
    public graficiService: GraficiService,
    public variabiliService: VariabiliService,
  ) {
  }

  segmentGrafico(event: any) {
    console.log("segmentGrafico", event.detail.value)
    this.visualizzaGrafico = event.detail.value
  }

  tooggleChartsParameters(parameter:any) {
    if (this.variabiliService.chartParameters[parameter]) {
      this.variabiliService.chartParameters[parameter] = false
    } else {
      this.variabiliService.chartParameters[parameter] = true
    }
    this.graficiService.aggiornaParametriGrafici()
  }

  ngOnInit() { 
  }

  ngOnDestroy() {
  }


}
