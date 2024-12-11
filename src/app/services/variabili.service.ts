import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

//import { PickerController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { Geolocation } from '@capacitor/geolocation';
import { Network } from '@capacitor/network';

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
  calibrationCloud: boolean = false
  calibData = {
    "type": "",
    "micType": "",
    "externalMic": ""
  }

  range = {
    "lower": 0,
    "upper": 110
  }

  userData = {
    "age": "", // range 0-100
    "gender": "", // female, male, other
    "type": "" //
  }

  privacyAccepted: boolean = false

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
    "extension": ".txt",
    "date_format": "YYYY-MM-DD",
    "debug": false
  }

  mainLevel = 'LAeq(1s)'
  countdownNumber: string = '3'

  rangeFreqHz = {
    "lower": 16,
    "upper": 20000
  }

  rotateIOS: any

  // METADATA
  metadataValuesLabels: any

  modalData: any

  lastPosition: any

  constructor(
    private alertController: AlertController
  ) {

    this.dataRefreshBS = new BehaviorSubject(new Date())

    var translation_en = require('../../assets/i18n/en.json')
    var translation_it = require('../../assets/i18n/it.json')
    this.translation = translation_en.TRANSLATION

    this.setMetadataValuesLabels(translation_en.TRANSLATION, translation_it.TRANSLATION)

  }

  setDataRefreshBS(value: any) {
    this.dataRefreshBS.next(value)
  }

  getDataRefreshBS() {
    return this.dataRefreshBS.asObservable();
  }

  async locPermissions() {
    console.log("variabileService locPermissions")
    var permissionOutput = {
      coarseLocation: 'denied',
      location: 'denied'
    }
    try {
      const permission = await Geolocation.requestPermissions({ permissions: ['location'] })
      console.log("variabileService locPermissions", permission)

      permissionOutput = {
        coarseLocation: permission.coarseLocation,
        location: permission.location
      }

      if (permission.coarseLocation == "granted" || permission.location == "granted") {
        this.getLocPosition()
      }
    } catch (err) {
      console.log("locPermissions err", err)
      var output = this.locationMessage(err)
    }

    return Promise.resolve(permissionOutput)
  }

  async getLocPosition() {
    console.log("variabiliService getPosition")

    var output = {
      "lat": "",
      "lon": ""
    }

    try {
      const geolocationOuput = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 3000 });
      //console.log("getLocPosition coordinates: ", geolocationOuput)
      output.lat = (geolocationOuput.coords.latitude).toFixed(6)
      output.lon = (geolocationOuput.coords.longitude).toFixed(6)
    } catch (err) {
      console.log("getLocPosition err", err)
      output = this.locationMessage(err)
    }

    this.lastPosition = {
      lan: output.lat,
      lon: output.lon
    }

    console.log("getLocPosition output", output)

    return Promise.resolve(output)
  }

  locationMessage(err: any) {
    // Error: Location permission was denied --> no permission
    // Error: location unavailable --> plane mode (forse)
    // Error: location disabled --> gps off
    console.log("getLocPosition err.message", err.message)
    var output: any = {
      lat: this.translation.OTHER.GPS_MESSAGE.NO_DATA,
      lon: this.translation.OTHER.GPS_MESSAGE.NO_DATA
    }
    if (err.message === 'Location permission was denied') {
      this.presentAlert(this.translation.MAP.ALERT_HEAD, "", this.translation.OTHER.GPS_MESSAGE.PERMITION_DENIED)
    } else if (err.message === 'location disabled') {
      this.presentAlert(this.translation.MAP.ALERT_HEAD, "", this.translation.OTHER.GPS_MESSAGE.LOCATION_DISABLED)
    } else if (err.message === 'location unavailable') {
      this.presentAlert(this.translation.MAP.ALERT_HEAD, "", this.translation.OTHER.GPS_MESSAGE.GENERIC)
    } else {
      this.presentAlert(this.translation.MAP.ALERT_HEAD, "", this.translation.OTHER.GPS_MESSAGE.GENERIC)
    }

    return output
  }

  setMetadataValuesLabels(translation_en: any, translation_it: any) {
    this.metadataValuesLabels = {
      "TYPE": [
        {
          "value": "outdoor",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.OUTDOOR,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.OUTDOOR,
          },
        },
        {
          "value": "openwindows",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.INDOOR_OPEN_WINDOWS,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.INDOOR_OPEN_WINDOWS,
          },
        },
        {
          "value": "closewindows",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.INDOOR_CLOSE_WINDOWS,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.INDOOR_CLOSE_WINDOWS,
          }
        }],
      "ENVIRONMENT": [
        {
          "value": "urban",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.ENVIRONMENT_URBAN,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.ENVIRONMENT_URBAN,
          }
        },
        {
          "value": "rural",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.ENVIRONMENT_RURAL,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.ENVIRONMENT_RURAL,
          }
        },
        {
          "value": "wilderness",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.ENVIRONMENT_WILDERNESS,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.ENVIRONMENT_WILDERNESS,
          }
        },
      ],
      "SOURCE": [
        {
          "value": "road",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_ROAD,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_ROAD,
          },
        },
        {
          "value": "railway",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_RAILWAY,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_RAILWAY,
          }
        },
        {
          "value": "airplane",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_AIRPLANE,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_AIRPLANE,
          }
        },
        {
          "value": "boat",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_BOAT,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_BOAT,
          }
        },
        {
          "value": "electromechanical",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_ELECTRO_MECHANICAL,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_ELECTRO_MECHANICAL,
          }
        },
        {
          "value": "voice",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_VOICE,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_VOICE,
          }
        },
        {
          "value": "music",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_MUSIC,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_MUSIC,
          }
        },
        {
          "value": "nature",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_NATURE,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_NATURE,
          }
        },
        {
          "value": "otherSource",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_OTHER,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_OTHER,
          }
        },
      ],
      "WEATHER": [
        {
          "value": "dry",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_DRY,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_DRY,
          }
        },
        {
          "value": "rainy",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_RAINY,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_RAINY,
          }
        },
        {
          "value": "wet",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_WET,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_WET,
          }
        },
        {
          "value": "windy",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_WINDY,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_WINDY,
          }
        },
        {
          "value": "snow",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_SNOW,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_SNOW,
          }
        },
        {
          "value": "cloudy",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_CLOUDY,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_CLOUDY,
          }
        },
        {
          "value": "otherWeather",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_OTHER,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_OTHER,
          }
        },
      ],
      "WHYTAKENOISE": [
        {
          "value": "test",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_TEST,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_TEST,
          }
        },
        {
          "value": "annoyed",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_ANNOYED,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_ANNOYED,
          }
        },
        {
          "value": "professional",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_PROFESSIONAL,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_PROFESSIONAL,
          }
        },
        {
          "value": "study",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_STUDY,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_STUDY,
          }
        },
        {
          "value": "educational",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_EDUCATIONAL,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_EDUCATIONAL,
          }
        },
        {
          "value": "entertaiment",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_ENTERTAIMENT,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_ENTERTAIMENT,
          }
        },
        {
          "value": "otherWhy",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_OTHER,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_OTHER,
          }
        },
      ],
      "FEELING": [
        {
          "value": -1,
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.METADATA_BAR_NODATA,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.METADATA_BAR_NODATA,
          }
        }, {
          "value": 0,
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.METADATA_FEELING_VERYBAD,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.METADATA_FEELING_VERYBAD,
          }
        }, {
          "value": 1,
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.METADATA_FEELING_BAD,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.METADATA_FEELING_BAD,
          }
        }, {
          "value": 2,
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.METADATA_FEELING_NOBAD,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.METADATA_FEELING_NOBAD,
          }
        }, {
          "value": 3,
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.METADATA_FEELING_GOOD,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.METADATA_FEELING_GOOD,
          }
        }, {
          "value": 4,
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.METADATA_FEELING_VERYGOOD,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.METADATA_FEELING_VERYGOOD,
          }
        },
      ],
      "APPROPRIATE": [
        {
          "value": -1,
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.METADATA_BAR_NODATA,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.METADATA_BAR_NODATA,
          }
        }, {
          "value": 10,
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.METADATA_APPROPRIATE_NOTATALL,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.METADATA_APPROPRIATE_NOTATALL,
          }
        }, {
          "value": 11,
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.METADATA_APPROPRIATE_SLIGHTLY,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.METADATA_APPROPRIATE_SLIGHTLY,
          }
        }, {
          "value": 12,
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.METADATA_APPROPRIATE_MODERATELY,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.METADATA_APPROPRIATE_MODERATELY,
          }
        }, {
          "value": 13,
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.METADATA_APPROPRIATE_VERY,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.METADATA_APPROPRIATE_VERY,
          }
        }, {
          "value": 14,
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.METADATA_APPROPRIATE_PERFECTLY,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.METADATA_APPROPRIATE_PERFECTLY,
          }
        },
      ],
      "CLOUD": [
        {
          "value": "cloud-true",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.CLOUD_YES,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.CLOUD_YES,
          }
        },
        {
          "value": "cloud-false",
          "labels": {
            "it": translation_it.SAVE_FILES.EDIT_DESCRIPTION.CLOUD_NO,
            "en": translation_en.SAVE_FILES.EDIT_DESCRIPTION.CLOUD_NO,
          }
        }
      ]
    }
  }

  metadataFromValueToLabel(valueMetadata: any) {
    var output = {
      metadataProperty: "",
      label: ""
    }
    for (let m in this.metadataValuesLabels) {
      for (let el of this.metadataValuesLabels[m]) {
        if (valueMetadata == el.value) {
          output.metadataProperty = m
          output.label = el.labels[this.language]
        }
      }
    }
    // console.log("metadataFromValueToLabel output", output)
    return output
  }

  metadataFromLabelToValue(labelMetadata: string) {
    var output = {
      metadataProperty: "",
      value: ""
    }
    for (let m in this.metadataValuesLabels) {
      for (let el of this.metadataValuesLabels[m]) {
        for (let lang in el.labels) {
          if (labelMetadata == el.labels[lang]) {
            output.metadataProperty = m
            output.value = el.value
          }
        }
      }
    }
    // console.log("metadataFromLabelToValue output", output)
    return output
  }

  async checkNetwork() {
    console.log("checkNetwork")

    let status = await Network.getStatus();
    console.log("checkNetwork Network.getStatus", status)
    return status.connected
  }

  async presentAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['OK'],
      cssClass: 'alertClass'
    });

    await alert.present();
  }

}
