import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { 
  IonCard,
  IonCol,
  IonIcon,
  IonGrid,
  IonLabel,
  IonRow,
  IonTabButton
} from '@ionic/angular/standalone';

import { AudioService } from '../../services/audio.service';
import { VariabiliService } from 'src/app/services/variabili.service';
import { OrientationService } from 'src/app/services/orientation.service';
import { DatetimeService } from 'src/app/services/datetime.service';


@Component({
  selector: 'app-livelli',
  templateUrl: './livelli.component.html',
  styleUrls: ['./livelli.component.scss'],
  imports: [
    IonCard,
    IonCol,
    IonIcon,
    IonGrid,
    IonLabel,
    IonRow,
    IonTabButton,
    CommonModule
  ]
})
export class LivelliComponent  implements OnInit {

  constructor(
    public audioService: AudioService,
    public variabiliService: VariabiliService,
    public orientationService: OrientationService,
    private datetimeService: DatetimeService
  ) { }

  formatDate(date: any) {
    var output = ''
    if (date != '' && this.variabiliService.language === 'en') {
      this.datetimeService.setLanguage('enUS')
      output = this.datetimeService.newDate(date).format('EEE MM/dd HH:mm:ss')
    } else {
      if (date != '' && this.variabiliService.language === 'it') {
        this.datetimeService.setLanguage('it')
        output = this.datetimeService.newDate(date).format('EEE dd/MM HH:mm:ss')
      }
    }

    return output
  }

  formatNumber(input: number) {
    return input.toFixed(1)
  }

  rotate() {
    this.orientationService.rotateOrientationToogle()
  }

  ngOnInit() { }


}
