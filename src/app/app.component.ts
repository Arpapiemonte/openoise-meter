import { Component } from '@angular/core';

import { KeepAwake } from '@capacitor-community/keep-awake';

import { AlertController } from '@ionic/angular';

import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Device } from '@capacitor/device';

import { TranslateService } from '@ngx-translate/core';

import { PreferencesService } from './services/preferences.service';
import { VariabiliService } from './services/variabili.service';
import { GraficiService } from './services/grafici.service';
import { OrientationService } from './services/orientation.service';
import { ColorModeService } from './services/color-mode.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  constructor(
    private alertController: AlertController,
    private translateService: TranslateService,
    private preferencesService: PreferencesService,
    private variabiliService: VariabiliService,
    private graficiService: GraficiService,
    public orientationService: OrientationService,
    private colorModeService: ColorModeService
  ) {

    // parte con plugin cordova
    // window.screen.orientation.lock('portrait-primary');
    // console.log('Orientation is ' + window.screen.orientation.type)

    // parte con plugin capacitor
    // ScreenOrientation.orientation().then(res => {
    //   console.log("ScreenOrientation.orientation res.type", res.type)
    // })
    ScreenOrientation.lock({ orientation: 'portrait-primary' })

    this.inizializzaApp()

  }

  async inizializzaApp() {

    await this.setLanguage()

    await this.keepAwake()

    await this.recuperaPreferences()
    this.colorModeService.inizializeColorMode()
    
  }

  async recuperaPreferences() {

    var ruotaSchermo = await this.preferencesService.get('ruotaSchermo')
    if (ruotaSchermo == null) {
      console.log("ruotaSchermo non esiste, la inizializzo")
      this.preferencesService.set("ruotaSchermo", this.variabiliService.ruotaSchermo)
    } else {
      console.log("ruotaSchermo esiste", ruotaSchermo)
      this.variabiliService.ruotaSchermo = ruotaSchermo
    }
    this.orientationService.rotateOrientation(this.variabiliService.ruotaSchermo)

    var dbGain = await this.preferencesService.get('dbGain')
    if (dbGain == null) {
      console.log("dbGain non esiste, la inizializzo")
      this.preferencesService.set("dbGain", this.variabiliService.dbGain)
    } else {
      console.log("dbGain esiste", dbGain)
      this.variabiliService.dbGain = dbGain
    }

    var rangeAssi = await this.preferencesService.get('rangeAssi')
    if (rangeAssi == null) {
      console.log("rangeAssi non esiste, la inizializzo")
      this.preferencesService.set("rangeAssi", this.variabiliService.range)
    } else {
      console.log("rangeAssi esiste", rangeAssi)
      this.variabiliService.range = rangeAssi
      this.graficiService.aggiornaAssiGrafici()
    }

    var saveOptions = await this.preferencesService.get('saveOptions')
    if (saveOptions == null) {
      console.log("saveOptions non esiste, la inizializzo")
      this.preferencesService.set("saveOptions", this.variabiliService.saveOptions)
    } else {
      console.log("saveOptions esiste", saveOptions)
      if (!("extension" in saveOptions)) {
        saveOptions["extension"] = this.variabiliService.saveOptions.extension
      }
      if (!("date_format" in saveOptions)) {
        saveOptions["date_format"] = this.variabiliService.saveOptions.date_format
      }
      this.variabiliService.saveOptions = saveOptions
    }

    var mainLevel = await this.preferencesService.get('mainLevel')
    if (mainLevel == null) {
      console.log("mainLevel non esiste, la inizializzo")
      this.preferencesService.set("mainLevel", this.variabiliService.mainLevel)
    } else {
      console.log("mainLevel esiste", mainLevel)
      this.variabiliService.mainLevel = mainLevel
    }

    var levelsOrientation = await this.preferencesService.get('levelsOrientation')
    if (levelsOrientation == null) {
      console.log("levelsOrientation non esiste, la inizializzo")
      this.preferencesService.set("levelsOrientation", this.variabiliService.levelsOrientation)
    } else {
      console.log("levelsOrientation esiste", levelsOrientation)
      this.variabiliService.levelsOrientation = levelsOrientation
    }

    var countdownNumber = await this.preferencesService.get('countdownNumber')
    if (countdownNumber == null) {
      console.log("countdownNumber non esiste, la inizializzo")
      this.preferencesService.set("countdownNumber", this.variabiliService.countdownNumber)
    } else {
      console.log("countdownNumber esiste", countdownNumber)
      this.variabiliService.countdownNumber = String(countdownNumber)
    }

    var rangeFreqHz = await this.preferencesService.get('rangeFreqHz')
    if (rangeFreqHz == null) {
      console.log("rangeFreqHz non esiste, la inizializzo")
      this.preferencesService.set("rangeFreqHz", this.variabiliService.rangeFreqHz)
    } else {
      console.log("rangeFreqHz esiste", rangeFreqHz)
      this.variabiliService.rangeFreqHz = rangeFreqHz
    }

  }

  async keepAwake() {

    const result = await KeepAwake.isSupported();
    console.log("keepAwake result.isSupported", result.isSupported)

    if (result.isSupported) {
      const keepAwake = await KeepAwake.keepAwake();
      console.log("keepAwake", keepAwake)
    }

  }

  async setLanguage() {

    this.translateService.setDefaultLang('en');

    const languageDevice = await Device.getLanguageCode();
    console.log("languageDevice", languageDevice.value);

    var language = await this.preferencesService.get('language')
    if (language == null) {
      console.log("language non esiste, la inizializzo")
      if (languageDevice.value === 'it') {
        this.variabiliService.language = 'it'
      } else {
        this.variabiliService.language = 'en'
      }
    } else {
      console.log("language esiste", language)
      this.variabiliService.language = language
    }

    this.preferencesService.set("language", this.variabiliService.language)

    this.translateService.use(this.variabiliService.language);
    this.translateService.stream('TRANSLATION').subscribe((res: any) => {
      console.log("translateService", res)
      this.variabiliService.translation = res
      this.graficiService.aggiornaLabelGrafici()
      this.checkFirstTime()
    });

  }

  async checkFirstTime() {
    console.log("checkFirstTime")
    var firstTime = await this.preferencesService.get('firstTime')
    if (firstTime == null) {
      console.log("firstTime")
      this.alertFirstTime()
    } else {
      console.log("firstTime", firstTime)
    }
  }

  async alertFirstTime() {
    const alert = await this.alertController.create({
      cssClass: 'alertFirstTime',
      header: this.variabiliService.translation.PREMETER.HEADER_FIRST_TIME,
      subHeader: "",
      message: this.variabiliService.translation.PREMETER.MESSAGE_FIRST_TIME,
      buttons: [
        {
          text: this.variabiliService.translation.PREMETER.OK,
          role: 'confirm',
          handler: () => {
            console.log("alertFirstTime OK")
            this.preferencesService.set("firstTime", "no")
          },
        },
      ]
    });

    await alert.present();
  }

}
