import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

//import { PickerController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class VariabiliService {
  public dataRefreshBS: BehaviorSubject<any>;

  ruotaSchermo: Boolean = false

  firstTime: Boolean = true

  levelsOrientation: string = 'verticale'
  colorMode: string = 'auto'
  language: string = 'en'
  translation: any

  time: number = 1000;
  numberSec: number = 30;
  dbGain: number = 0;

  range = {
    "lower": 0,
    "upper": 110
  }

  chartVisibiltyGlobalsLAeq1s: boolean = true
  chartVisibiltyGlobalsLAeqt: boolean = true

  chartParameters = {
    "GLOBALS_LAEQ1s": true,
    "GLOBALS_LAEQt": true,
    "OCTAVES_LZEQ1s": true,
    "OCTAVES_LZEQt": true,
    "OCTAVES_LZmin": true,
    "OCTAVES_LZmax": true,
    "FFT_LAEQ1s": true,
    "FFT_LZEQ1s": true,
  }

  saveOptions = {
    "bandLZeq": false,
    "bandLZmin": false,
    "decimal": ".",
    "field": ";",
    "extension": ".txt"
  }

  mainLevel = 'LAeq(1s)'
  countdownNumber: string = '3'

  rangeFreqHz = {
    "lower": 16,
    "upper": 20000
  }

  rotateIOS: any

  constructor() {

    this.dataRefreshBS = new BehaviorSubject(new Date())

    var translation = require('../../assets/i18n/en.json')
    this.translation = translation.TRANSLATION

  }

  setDataRefreshBS(value: any) {
    this.dataRefreshBS.next(value)
  }

  getDataRefreshBS() {
    return this.dataRefreshBS.asObservable();
  }

}
