import { Component, OnInit } from '@angular/core';

import { GraficiService } from '../../services/grafici.service';
import { VariabiliService } from 'src/app/services/variabili.service';

@Component({
  selector: 'app-grafici',
  templateUrl: './grafici.component.html',
  styleUrls: ['./grafici.component.scss'],
})
export class GraficiComponent implements OnInit {


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
