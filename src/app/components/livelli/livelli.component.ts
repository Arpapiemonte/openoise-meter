import { Component, OnInit } from '@angular/core';

import { AudioService } from '../../services/audio.service';
import { VariabiliService } from 'src/app/services/variabili.service';
import { OrientationService } from 'src/app/services/orientation.service';

import * as moment from 'moment'
import 'moment/locale/it';


@Component({
  selector: 'app-livelli',
  templateUrl: './livelli.component.html',
  styleUrls: ['./livelli.component.scss'],
})
export class LivelliComponent implements OnInit {

  constructor(
    public audioService: AudioService,
    public variabiliService: VariabiliService,
    public orientationService: OrientationService,
  ) { }

  formatDate(date:any) {
    var output = ''
    if (date != '' && this.variabiliService.language === 'en') {
      moment.locale('en-GB');
      output = moment(date).format("ddd MM/DD HH:mm:ss")
    } else {
      if (date != '' && this.variabiliService.language === 'it') {
        moment.locale('it-IT');
        output = moment(date).format("ddd DD/MM HH:mm:ss")
    }
  }
    return output
  }

  formatNumber(input:number) {
    return input.toFixed(1)
  }

  rotate() {
    this.orientationService.rotateOrientationToogle()
  }

  ngOnInit() {}

}
