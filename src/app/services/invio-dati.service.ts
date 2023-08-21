import { Injectable } from '@angular/core';

import { AlertController } from '@ionic/angular';

import { Network } from '@capacitor/network';
import { Device } from '@capacitor/device';
import { Geolocation } from '@capacitor/geolocation';

import { VariabiliService } from './variabili.service';

@Injectable({
  providedIn: 'root'
})
export class InvioDatiService {

  constructor(
    private alertController: AlertController,
    public variabiliService: VariabiliService,
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

  async presentAlertDataCalFinale() {

    const alert = await this.alertController.create({
      header: this.variabiliService.translation.SETTINGS.SEND_CALIBDATA.SEND_CALIBDATA_ATTENTION,
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


  async sendDataCalibration(inputUserType: any, inputCalibType: any) {

    var network = await this.checkNetwork()
    console.log("sendDataCalibration Network", network)

    if (network === false) {
      this.presentAlertNoNetwork()
      return Promise.resolve(false)
    }

    var lat: any
    var lon: any

    try {
      // console.log("sendDataCalibration Geolocation start")
      const coordinates = await Geolocation.getCurrentPosition({timeout: 3});
      console.log("sendDataCalibration Geolocation coordinates: ", coordinates)
      lat = coordinates.coords.latitude
      lon = coordinates.coords.longitude
    } catch (err) {
      console.log("sendDataCalibration Geolocation err", err)
      if (err.message === 'Location permission was denied') {
        lat = "Permission denied"
        lon = "Permission denied"
      } else {
        lat = "ERROR"
        lon = "ERROR"
      }
    }

    const device = await Device.getInfo();

    var details = {
      lat: String(lat),
      lon: String(lon),
      so_type: device.operatingSystem,
      so_version: String(device.osVersion),
      phone_type: device.model,
      freq_max: 'default',
      freq_min: 'default',
      gain: String(this.variabiliService.dbGain),
      calib_type: inputCalibType,
      user_type: inputUserType,
      codice_sicurezza: 'PASSWORD'
    }

    var formBody: any = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const response = await fetch("URL", {
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
      this.presentAlertDataCalFinale()
      return Promise.resolve(true)
    } else {
      return Promise.resolve(false)
    }
    
  }

}
