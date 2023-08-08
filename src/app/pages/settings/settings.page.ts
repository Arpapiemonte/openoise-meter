import { Component, ViewChild } from '@angular/core';
import { NgZone } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { PickerController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { Device } from '@capacitor/device';
import { Geolocation } from '@capacitor/geolocation';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';

import { TranslateService } from '@ngx-translate/core';

import { VariabiliService } from 'src/app/services/variabili.service';
import { GraficiService } from 'src/app/services/grafici.service';
import { PreferencesService } from 'src/app/services/preferences.service';
import { AudioService } from 'src/app/services/audio.service';
import { FilesystemService } from 'src/app/services/filesystem.service';
import { OrientationService } from 'src/app/services/orientation.service';
import { ColorModeService } from 'src/app/services/color-mode.service';



@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})

export class SettingsPage {
  @ViewChild(IonModal) modal: IonModal;

  logDeviceInfo: any
  platform: any

  audioSubscribe: any

  pickerCalibrazioneValuesInteger = []
  pickerCalibrazioneValuesDecimal = []
  calibrazioneInteger = []
  calibrazioneDecimal = []

  isModalOpen = false;

  modalArgument = ''
  modalRange: any

  selectedSeparator1: boolean
  selectedSeparator2: boolean
  selectedSeparator3: boolean

  selectedDecimal1: boolean
  selectedDecimal2: boolean

  labelFieldSeparator: string = ''
  labelDecSeparator: string = ''

  virgolaDisabledF: boolean = false
  virgolaDisabledD: boolean = false

  rangeFreq: any = {
    lower: 0,
    upper: 0
  }
  rangeFreqLowerDefault: boolean = true
  rangeFreqUpperDefault: boolean = true

  dataCalibration: any

  constructor(
    private zone: NgZone,
    private pickerCtrl: PickerController,
    private alertController: AlertController,
    private translateService: TranslateService,
    public variabiliService: VariabiliService,
    private graficiService: GraficiService,
    private preferencesService: PreferencesService,
    public audioService: AudioService,
    public fileSystemService: FilesystemService,
    public orientationService: OrientationService,
    private colorModeService: ColorModeService
  ) {

    for (let i = -50; i <= 50; i++) {
      var el = {
        text: i,
        value: i,
      }
      this.pickerCalibrazioneValuesInteger.push(el)
      this.calibrazioneInteger.push(i)
    }
    for (let i = 0; i <= 9; i++) {
      var el = {
        text: i,
        value: i,
      }
      this.pickerCalibrazioneValuesDecimal.push(el)
      this.calibrazioneDecimal.push(i)
    }

  }

  apriCalibrazione() {
    if (this.audioService.capture) {
      this.presentAlertCalibrazione()
    } else {
      this.apriModal('calibrazione')
      this.audioService.startAudio()
      this.audioService.captureCalibrazione = true
    }
  }

  async apriPickerCalibrazione() {

    var dbGainInteger = Math.trunc(this.variabiliService.dbGain)
    var dbGainDecimal = Math.abs(Number((this.variabiliService.dbGain - dbGainInteger).toFixed(1))) * 10

    const picker = await this.pickerCtrl.create({
      mode: 'ios',
      columns: [
        {
          name: 'valoriInteri',
          prefix: this.variabiliService.translation.SETTINGS.CALIBRATION.CALIBRATION_INTEGER,
          options: this.pickerCalibrazioneValuesInteger,
          selectedIndex: this.calibrazioneInteger.indexOf(dbGainInteger)
        },
        {
          name: 'valoriDecimali',
          prefix: this.variabiliService.translation.SETTINGS.CALIBRATION.CALIBRATION_DECIMAL,
          options: this.pickerCalibrazioneValuesDecimal,
          selectedIndex: this.calibrazioneDecimal.indexOf(dbGainDecimal)
        },
      ],
      buttons: [
        {
          text: this.variabiliService.translation.SETTINGS.CALIBRATION.CALIBRATION_CANCEL,
          role: 'cancel',
        },
        {
          text: this.variabiliService.translation.SETTINGS.CALIBRATION.CALIBRATION_OK,
          handler: (value) => {
            createDBGain()
              .then(res => {
                if (res != this.variabiliService.dbGain) {
                  this.presentAlertConfermaCalibrazione(res)
                }
              })
          },
        },
      ],
    });

    console.log("apriPickerCalibrazione prima del present")

    await picker.present();

    console.log("apriPickerCalibrazione alla fine")

    async function createDBGain() {
      let valIntero = await picker.getColumn('valoriInteri');
      let valDecimale = await picker.getColumn('valoriDecimali');
      return Promise.resolve(parseFloat(valIntero.options[valIntero.selectedIndex].value + '.' + valDecimale.options[valDecimale.selectedIndex].value))
    }

    // picker.onDidDismiss().then(async data => {
    //   let valIntero = await picker.getColumn('valoriInteri');
    //   let valDecimale = await picker.getColumn('valoriDecimali');
    //   this.variabiliService.dbGain = parseFloat(valIntero.options[valIntero.selectedIndex].value + '.' + valDecimale.options[valDecimale.selectedIndex].value);
    //   console.log('this.variabiliService.dbGain new: ', this.variabiliService.dbGain);
    //   this.preferencesService.set("dbGain", this.variabiliService.dbGain)
    // });
  }

  // PROVE PER INVIO DATI A SERVER ARPA
  async getDeviceDataInformation() {
    // const coordinates = await Geolocation.getCurrentPosition();

    // this.dataCalibration = {
    //   lat: String(coordinates.coords.latitude),
    //   lon: String(coordinates.coords.longitude),
    //   so_type: this.logDeviceInfo.operatingSystem,
    //   so_version: String(this.logDeviceInfo.osVersion),
    //   phone_type: this.logDeviceInfo.model,
    //   freq_max: String(0),
    //   fre_min: String(0),
    //   gain: String(this.variabiliService.dbGain),
    //   calib_type: 'Confronto',
    //   user_type: 'Avanzato',
    //   codice_sicurezza: 'AAssEE44ttggVV&rrrr'
    // }

    // this.dataCalibration = {
    //   'lat': 'stefano_fetch01',
    //   'lon': 'aaa',
    //   'so_type': 'aaa',
    //   'so_version': 'aaa',
    //   'phone_type': 'aaa',
    //   'freq_max': 'aaa',
    //   'fre_min': 'aaa',
    //   'gain': 'aaa',
    //   'calib_type': 'aaa',
    //   'user_type': 'aaa',
    //   'codice_sicurezza': 'AAssEE44ttggVV&rrrr'
    // }

    this.dataCalibration = {
      lat: "stefano_fetch01",
      lon: "aaa",
      so_type: "aaa",
      so_version: "aaa",
      phone_type: "aaa",
      freq_max: "aaa",
      fre_min: "aaa",
      gain: "aaa",
      calib_type: "aaa",
      user_type: "aaa",
      codice_sicurezza: "AAssEE44ttggVV&rrrr"
    }

    console.log("dataCalibration", this.dataCalibration)

    //return(this.dataCalibration)
    //console.log(JSON.stringify(this.dataCalibration))
  };

  // PROVA CON PLUGIN COMUNITY
  // async sendDataCalibration(){
  //   const options = {
  //     url: 'https://utility.arpa.piemonte.it/post_opennoise/send_data.php',
  //     headers: { 'Content-Type': 'application/json' },
  //     //data: JSON.stringify(this.dataCalibration),
  //     data: {"lat":"45.5512446","lon":"8.0472977","so_type":"android","so_version":"11","phone_type":"Redmi Note 8 Pro","freq_max":"0","fre_min":"0","gain":"22","calib_type":"Confronto","user_type":"Avanzato","codice_sicurezza":"AAssEE44ttggVV&rrrr"},
  //   };

  //   const response: HttpResponse = await Http.post(options);
  //   // or...
  //    //const response = await Http.request({ ...options, method: 'POST' })
  // };


  // PROVA CON PLUGIN CAPACITORHTTP NATIVO
  // async sendDataCalibration() {
  //   let options = {
  //     url: 'https://utility.arpa.piemonte.it/post_opennoise/send_data.php',
  //     //methods: 'POST',
  //     headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  //     // data: JSON.stringify(JSON.parse(JSON.stringify(this.dataCalibration))),
  //     data: JSON.stringify(this.dataCalibration),
  //   };
  //   const response: HttpResponse = await CapacitorHttp.post(options);
  //   console.log('response: ', response);
  // };


  // PROVA CON FETCH DI JS
  async sendDataCalibration() {
    console.log("sendDataCalibration fetch", this.dataCalibration)
    console.log("sendDataCalibration fetch JSON.stringify", JSON.stringify(this.dataCalibration))
    const response = await fetch("https://utility.arpa.piemonte.it/post_opennoise/send_data.php", {
      method: "POST",
      // mode: 'no-cors',
      headers: {
        "Content-Type": "application/json",
        // "Content-Type": "text/plain",
      },
      body: this.dataCalibration,
    })

    const text = await response.text();
    console.log("sendDataCalibration Success:", text);

    // lettura
    const letturaResponse = await fetch("https://utility.arpa.piemonte.it/post_opennoise/visualizza.php")
    const letturaText = await letturaResponse.text()
    console.log("sendDataCalibration response",letturaText)
  }

  // FINE PROVE INVIO DATI A SERVER ARPA


  apriModal(input: string) {
    console.log("apriModal", input)
    this.modalArgument = input
    this.setOpen(true)
    //this.modalRange = this.variabiliService.range
  }

  async presentAlertCalibrazione() {
    const alert = await this.alertController.create({
      header: 'ATTENZIONE',
      subHeader: "",
      message: "Misura in corso, fermare la misura per fare la calibrazione.",
      buttons: ['OK'],
    });

    await alert.present();
  }

  async presentAlertConfermaCalibrazione(newDBGain: number) {

    const alert = await this.alertController.create({
      header: this.variabiliService.translation.SETTINGS.CALIBRATION.CALIBRATION_WARNING,
      subHeader: "",
      message: this.variabiliService.translation.SETTINGS.CALIBRATION.CALIBRATION_CONFIRM_QUESTION,

      buttons: [
        {
          text: this.variabiliService.translation.SETTINGS.CALIBRATION.CALIBRATION_CANCEL,
          role: 'cancel',
          handler: () => {
            console.log("cambio calibrazione annullata")
          },
        },
        {
          text: this.variabiliService.translation.SETTINGS.CALIBRATION.CALIBRATION_YES,
          role: 'confirm',
          handler: () => {
            console.log("cambio calibrazione OK")
            this.variabiliService.dbGain = newDBGain
            console.log('this.variabiliService.dbGain new: ', this.variabiliService.dbGain);
            this.preferencesService.set("dbGain", this.variabiliService.dbGain)
            this.getDeviceDataInformation()
          },
        },
      ]

    });

    await alert.present();


  }


  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  chiudiModal() {
    this.setOpen(false)
  }

  onWillModalDismiss(event: any) {
    console.log("onWillModalDismiss")
    this.isModalOpen = false;
    if (this.audioService.captureCalibrazione) {
      this.audioService.stopCapture()
      this.audioService.captureCalibrazione = false
    }
  }

  rangeAssiMoveEnd(ev: any) {
    console.log("rangeAssiMoveEnd", ev.detail.value)
    this.variabiliService.range = ev.detail.value
    this.graficiService.aggiornaAssiGrafici()
    this.preferencesService.set("rangeAssi", this.variabiliService.range)
  }

  formatNumber(input: number) {
    return input.toFixed(1)
  }

  segmentChangedMainLevel(event: any) {
    console.log("this.mainLevel: ", this.variabiliService.mainLevel);
    this.preferencesService.set("mainLevel", this.variabiliService.mainLevel);
  }

  toggleChangeRuotaSchermo(event: any) {
    console.log("toggleChangeRuotaSchermo", event.detail.checked)

    this.variabiliService.ruotaSchermo = event.detail.checked
    this.preferencesService.set("ruotaSchermo", this.variabiliService.ruotaSchermo)
  }

  toggleChangeSaveLZeq(event: any) {
    console.log("toggleChangeSaveLZeq", event.detail.checked)

    this.variabiliService.saveOptions.bandLZeq = event.detail.checked
    this.preferencesService.set("saveOptions", this.variabiliService.saveOptions)
  }

  toggleChangeSaveLZmin(event: any) {
    console.log("toggleChangeSaveLZmin", event.detail.checked)

    this.variabiliService.saveOptions.bandLZmin = event.detail.checked
    this.preferencesService.set("saveOptions", this.variabiliService.saveOptions)
  }


  setDecSeparator(event: any) {

    this.setVirgolaDisability()

    console.log("this.variabiliService.saveOptions.decimal: ", this.variabiliService.saveOptions.decimal);
    this.preferencesService.set("saveOptions", this.variabiliService.saveOptions);
  }


  setVirgolaDisability() {
    if (this.variabiliService.saveOptions.decimal === ',') {
      this.virgolaDisabledF = true
    } else {
      this.virgolaDisabledF = false
    }

    if (this.variabiliService.saveOptions.field === ',') {
      this.virgolaDisabledD = true
    } else {
      this.virgolaDisabledD = false
    }
  }

  setFieldSeparator(event: any) {

    this.setVirgolaDisability()

    console.log("this.variabiliService.saveOptions.field: ", this.variabiliService.saveOptions.field);
    this.preferencesService.set("saveOptions", this.variabiliService.saveOptions);
  }


  segmentChangedCountdownNumber(event: any) {
    console.log("this.mainLevel: ", this.variabiliService.countdownNumber);
    console.log("event: ", event);
    this.preferencesService.set("countdownNumber", this.variabiliService.countdownNumber);
  }

  rangeFreqChange(event: any) {
    console.log("rangeFreqChange event", event.detail.value)
    // console.log(this.audioService.thirdOctave[event.detail.value.lower])
    // console.log(this.audioService.thirdOctave[event.detail.value.upper])

    this.variabiliService.rangeFreqHz.lower = this.audioService.thirdOctave[event.detail.value.lower]
    this.variabiliService.rangeFreqHz.upper = this.audioService.thirdOctave[event.detail.value.upper]
    this.preferencesService.set("rangeFreqHz", this.variabiliService.rangeFreqHz);

    this.setRangeFreqDefault()

  }

  setRangeFreq() {
    // console.log("setRangeFreq")
    this.rangeFreq = {
      lower: this.audioService.thirdOctave.indexOf(this.variabiliService.rangeFreqHz.lower),
      upper: this.audioService.thirdOctave.indexOf(this.variabiliService.rangeFreqHz.upper)
    }
    // console.log("rangeFreq", this.rangeFreq)

    this.setRangeFreqDefault()
  }

  setRangeFreqDefault() {
    if (this.variabiliService.rangeFreqHz.lower == 200) {
      this.rangeFreqLowerDefault = true
    } else {
      this.rangeFreqLowerDefault = false
    }
    if (this.variabiliService.rangeFreqHz.upper == 10000) {
      this.rangeFreqUpperDefault = true
    } else {
      this.rangeFreqUpperDefault = false
    }
  }

  segmentChangedLevelsOrientation(event: any) {
    console.log("segmentChangedLevelsOrientation event: ", event.detail.value);
    this.preferencesService.set("levelsOrientation", this.variabiliService.levelsOrientation);
  }

  segmentChangedColorMode(event: any) {
    console.log("segmentChangedColorMode event: ", event.detail.value);
    this.preferencesService.set("colorMode", this.variabiliService.colorMode);
    this.colorModeService.setColorMode(this.variabiliService.colorMode)
  }

  segmentChangedLanguage(event: any) {
    console.log("segmentChangedLanguage event: ", event.detail.value);
    this.preferencesService.set("language", this.variabiliService.language);
    this.translateService.use(this.variabiliService.language);
  }

  ionViewWillEnter() {
    console.log("SettingsPage ionViewWillEnter")
    this.setRangeFreq()
    this.setVirgolaDisability()
    this.modalRange = this.variabiliService.range

    Device.getInfo().then(logDeviceInfo => {
      console.log(logDeviceInfo);
      this.logDeviceInfo = logDeviceInfo
      this.platform = logDeviceInfo.platform
    })

    this.getDeviceDataInformation()

  }
  ionViewDidEnter() {
    console.log("SettingsPage ionViewDidEnter")
    this.audioSubscribe = this.audioService.variabiliService.getDataRefreshBS().subscribe(val => {
      console.log('SettingsPage getDataRefreshBS subscribe', val)
      this.zone.run(() => {
        console.log('force update the screen');
      });
    })

  }

  ionViewWillLeave() {
    console.log("SettingsPage ionViewWillLeave")
    this.audioSubscribe.unsubscribe()
  }
  ionViewDidLeave() {
    console.log("SettingsPage ionViewDidLeave")

  }

  ngOnDestroy() {
    console.log("SettingsPage ionViewWillEnter")
  }

  ngOnInit() {
    console.log("SettingsPage ngOnInit")
  }

}
