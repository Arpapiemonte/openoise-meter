import { Injectable } from '@angular/core';

import { AlertController } from '@ionic/angular';
// import { LoadingController } from '@ionic/angular';

import { Network } from '@capacitor/network';
import { Device } from '@capacitor/device';
//import { Geolocation } from '@capacitor/geolocation';

import { VariabiliService } from './variabili.service';
import { PreferencesService } from './preferences.service';

@Injectable({
  providedIn: 'root'
})
export class InvioDatiService {

  // loading: any

  constructor(
    private alertController: AlertController,
    // private loadingController: LoadingController,
    public variabiliService: VariabiliService,
    private preferencesService: PreferencesService
  ) {
  }

  async checkNetwork() {
    const status = await Network.getStatus();
    console.log('sendDataCalibration Network status:', status);

    var output: boolean = false
    if (status.connected) output = true

    return Promise.resolve(output)

  }

  async presentAlertNoNetwork() {

    const alert = await this.alertController.create({
      header: this.variabiliService.translation.SETTINGS.SEND_CALIBDATA.SEND_CALIBDATA_ATTENTION,
      subHeader: '',
      message: this.variabiliService.translation.SETTINGS.SEND_CALIBDATA.SEND_CALIBDATA_NO_NETWORK,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async presentAlertNoCoordinates() {

    const alert = await this.alertController.create({
      header: this.variabiliService.translation.SETTINGS.SEND_CALIBDATA.SEND_CALIBDATA_ATTENTION,
      subHeader: '',
      message: this.variabiliService.translation.SETTINGS.SEND_CALIBDATA.SEND_CALIBDATA_NO_COORDINATES,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async presentAlertDataCalFinale() {

    const alert = await this.alertController.create({
      header: this.variabiliService.translation.SETTINGS.SEND_CALIBDATA.SEND_CALIBDATA_CONGRATULATIONS,
      subHeader: '',
      message: this.variabiliService.translation.SETTINGS.SEND_CALIBDATA.SEND_CALIBDATA_FINALTEXT,
      buttons: [{
        text: 'OK',
        handler() {
        }
      }],
    });

    await alert.present();
  }

  async presentAlertMetaDataFinale() {

    const alert = await this.alertController.create({
      header: this.variabiliService.translation.SETTINGS.SEND_CALIBDATA.SEND_CALIBDATA_CONGRATULATIONS,
      subHeader: '',
      message: this.variabiliService.translation.SETTINGS.SEND_CALIBDATA.SEND_CALIBDATA_FINALTEXT,
      buttons: [{
        text: 'OK',
        handler() {
        }
      }],
    });

    await alert.present();
  }

  // async showLoading() {
  //   this.loading = await this.loadingController.create({
  //     // message: 'Dismissing after 3 seconds...',
  //     // duration: 3000,
  //   });

  //   this.loading.present();
  // }



  /*  async sendDataCalibration(inputUserData: any, inputCalibType: any, inputMicType: any, inputExternalMicType: any) {
 
     var network = await this.checkNetwork()
     console.log("sendDataCalibration Network", network)
 
     if (network === false) {
       this.presentAlertNoNetwork()
       return Promise.resolve(false)
     }
 
     var cooordinatesLatLon: any
     var lat: any
     var lon: any
 
     cooordinatesLatLon = await this.variabiliService.getLocPosition()
 
     lat = cooordinatesLatLon.lat
     lon = cooordinatesLatLon.lon
 
     const device = await Device.getInfo();
     const deviceId = await Device.getId();
     console.log("sendDataCalibration deviceId", deviceId)
     console.log("sendDataCalibration device", device)
 
     var details = {
       lat: String(lat),
       lon: String(lon),
       id: String(deviceId.identifier),
       so_type: device.operatingSystem,
       so_version: String(device.osVersion),
       so_number: (device.platform == 'android') ? String(device.androidSDKVersion) : String(device.iOSVersion),
       phone_type: device.model,
       phone_manufacturer: device. manufacturer,
       freq_max: 'default',
       freq_min: 'default',
       gain: String(this.variabiliService.dbGain),
       calib_type: inputCalibType,
       user_age: inputUserData.age,
       user_gender: inputUserData.gender,
       user_type: inputUserData.type,
       mic_type: inputMicType,
       external_mic_type: inputExternalMicType,
       codice_sicurezza: ''
     }
     console.log("sendDataCalibration dataToSend", details)
 
     var formBody: any = [];
     for (var property in details) {
       var encodedKey = encodeURIComponent(property);
       var encodedValue = encodeURIComponent(details[property]);
       formBody.push(encodedKey + "=" + encodedValue);
     }
     formBody = formBody.join("&");
 
     const response = await fetch("", {
       method: "POST",
       headers: {
         "Content-Type": "application/x-www-form-urlencoded",
       },
       body: formBody,
     })
     console.log("sendDataCalibration response", response);
 
     const text = await response.text();
     // console.log("sendDataCalibration Success stringify content python:", text);
 
     if (response.status === 200) {
       this.preferencesService.set("calibrationCloud", true)
       this.variabiliService.calibrationCloud = true
       this.presentAlertDataCalFinale()
       return Promise.resolve(true)
     } else {
       return Promise.resolve(false)
     }
 
   }
 
   async sendDataMeasurement(metadata:any) {
     console.log("sendDataMeasurement metadata", metadata)
 
     var network = await this.checkNetwork()
     console.log("sendDataMeasurement Network", network)
 
     if (network === false) {
       this.presentAlertNoNetwork()
       return Promise.resolve(false)
     }
 
     var cooordinatesLatLon: any
     var lat: any
     var lon: any
 
     cooordinatesLatLon = metadata.COORDINATES
     lat = cooordinatesLatLon[0]
     lon = cooordinatesLatLon[1]
 
     const device = await Device.getInfo();
     const deviceId = await Device.getId();
     console.log("sendDataMeasurement deviceId", deviceId)
     console.log("sendDataMeasurement device", device)
 
     var details = {
       lat: String(lat),
       lon: String(lon),
       id: String(deviceId.identifier),
       //so_type: device.operatingSystem,
       //so_version: String(device.osVersion),
       //so_number: (device.platform == 'android') ? String(device.androidSDKVersion) : String(device.iOSVersion),
       //phone_type: device.model,
       //phone_manufacturer: device. manufacturer,
       gain: metadata.CALIBRATION,
       laeq: metadata.LAEQ,
       duration: metadata.MEASURE_DURATION,
       start: metadata.MEASURE_START,
       stop: metadata.MEASURE_STOP,
       appropriate: metadata.APPROPRIATE,
       description: metadata.DESCRIPTION,
       feeling: metadata.FEELING,
       source: metadata.SOURCE,
       type: metadata.TYPE,
       weather: metadata.WEATHER,
       whytakenoise: metadata.WHYTAKENOISE,
       codice_sicurezza: ''
     }
     console.log("sendDataMeasurement dataToSend", details)
 
     var formBody: any = [];
     for (var property in details) {
       var encodedKey = encodeURIComponent(property);
       var encodedValue = encodeURIComponent(details[property]);
       formBody.push(encodedKey + "=" + encodedValue);
     }
     formBody = formBody.join("&");
 
     const response = await fetch("", {
       method: "POST",
       headers: {
         "Content-Type": "application/x-www-form-urlencoded",
       },
       body: formBody,
     })
     console.log("sendDataMeasurement response", response);
 
     const text = await response.text();
     // console.log("sendDataMeasurement Success stringify content python:", text);
 
     if (response.status === 200) {
       this.presentAlertMetaDataFinale()
       return Promise.resolve(true)
     } else {
       return Promise.resolve(false)
     }
   } */

  async sendData(inputUserData: any, inputcalibData: any, metadata: any) {
    console.log("sendData")

    var network = await this.checkNetwork()
    console.log("sendData Network", network)

    if (network === false) {
      this.presentAlertNoNetwork()
      return Promise.resolve(false)
    }

    // this.showLoading()

    const device = await Device.getInfo();
    //const deviceId = await Device.getId();
    //console.log("sendData deviceId", deviceId)
    console.log("sendData device", device)

    var details = null

    if (metadata === false) {

      var cooordinatesLatLon: any
      var lat: any
      var lon: any

      cooordinatesLatLon = await this.variabiliService.getLocPosition()

      // if (isNaN(cooordinatesLatLon.lat) === false) {
      //   this.loading.dismiss()
      //   return Promise.resolve(false)
      // }

      lat = cooordinatesLatLon.lat
      lon = cooordinatesLatLon.lon

      details = {
        //id: String(deviceId.identifier),
        so_type: device.operatingSystem,
        so_version: String(device.osVersion),
        so_number: (device.platform == 'android') ? String(device.androidSDKVersion) : String(device.iOSVersion),
        phone_type: device.model,
        phone_manufacturer: device.manufacturer,
        user_age: inputUserData.age,
        user_gender: inputUserData.gender,
        user_type: inputUserData.type,
        lat: String(lat),
        lon: String(lon),
        freq_max: 'default',
        freq_min: 'default',
        gain: String(this.variabiliService.dbGain),
        calib_type: this.variabiliService.calibData.type,
        mic_type: inputcalibData.micType,
        external_mic_type: inputcalibData.externalMic,
        laeq: "",
        duration: "",
        start: "",
        stop: "",
        description: "",
        type: "",
        environment: "",
        source: "",
        weather: "",
        whytakenoise: "",
        feeling: "",
        appropriate: "",
        codice_sicurezza: ''
      }
      console.log("sendData dataToSend", details)

    } else {
      console.log("sendDataMeasurement metadata", metadata)

      if (isNaN(metadata.COORDINATES[0])) {
        // if (this.loading) this.loading.dismiss()
        this.presentAlertNoCoordinates()
        return Promise.resolve(false)
      }

      details = {
        //id: String(deviceId.identifier),
        so_type: device.operatingSystem,
        so_version: String(device.osVersion),
        so_number: (device.platform == 'android') ? String(device.androidSDKVersion) : String(device.iOSVersion),
        phone_type: device.model,
        phone_manufacturer: device.manufacturer,
        user_age: inputUserData.age,
        user_gender: inputUserData.gender,
        user_type: inputUserData.type,
        lat: String(metadata.COORDINATES[0]),
        lon: String(metadata.COORDINATES[1]),
        freq_max: 'default',
        freq_min: 'default',
        gain: String(this.variabiliService.dbGain),
        calib_type: this.variabiliService.calibData.type,
        mic_type: inputcalibData.micType,
        external_mic_type: inputcalibData.externalMic,
        laeq: String(metadata.LAEQ),
        duration: String(metadata.MEASURE_DURATION),
        start: String(metadata.MEASURE_START),
        stop: String(metadata.MEASURE_STOP),
        description: String(metadata.DESCRIPTION),
        type: this.variabiliService.metadataFromLabelToValue(String(metadata.TYPE)).value,
        environment: this.variabiliService.metadataFromLabelToValue(String(metadata.ENVIRONMENT)).value,
        source: this.variabiliService.metadataFromLabelToValue(String(metadata.SOURCE)).value,
        weather: this.variabiliService.metadataFromLabelToValue(String(metadata.WEATHER)).value,
        whytakenoise: this.variabiliService.metadataFromLabelToValue(String(metadata.WHYTAKENOISE)).value,
        feeling: this.variabiliService.metadataFromLabelToValue(String(metadata.FEELING)).value,
        appropriate: this.variabiliService.metadataFromLabelToValue(String(metadata.APPROPRIATE)).value,
        codice_sicurezza: ''
      }
      console.log("sendDataMeasurement dataToSend", details)
    }

    var formBody: any = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const response = await fetch("", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody,
    })
    console.log("sendData response", response);

    const text = await response.text();
    // console.log("sendDataCalibration Success stringify content python:", text);
    // if (this.loading) this.loading.dismiss()
    if (response.status === 200) {
      if (metadata === false) {
        this.preferencesService.set("calibrationCloud", true)
        this.variabiliService.calibrationCloud = true
        this.presentAlertDataCalFinale()
      } else {
        this.presentAlertMetaDataFinale()
      }
      return Promise.resolve(true)
    } else {
      return Promise.resolve(false)
    }
  }

}
