import { Injectable } from '@angular/core';

import { ScreenOrientation } from '@capacitor/screen-orientation';

import { Device } from '@capacitor/device';

@Injectable({
  providedIn: 'root'
})
export class OrientationService {

  rotateIOS: string
  platform: string

  constructor() {

    Device.getInfo().then(logDeviceInfo => {
      console.log(logDeviceInfo);
      this.platform = logDeviceInfo.platform
    })

  }

  rotateOrientation(orientationInput: Boolean) {
    if (orientationInput) {
      if (this.platform === 'ios') {
        this.rotateIOS = "transform: rotate(180deg);"
      } else {
        ScreenOrientation.lock({ orientation: 'portrait-secondary' })
      }
    } else {
      if (this.platform === 'ios') {
        this.rotateIOS = "transform: rotate(0deg);"
      } else {
        ScreenOrientation.lock({ orientation: 'portrait-primary' })
      }
    }
  }

  async rotateOrientationToogle() {
    console.log("rotateOrientationToogle")

    if (this.platform === 'ios') {
      if (this.rotateIOS === "transform: rotate(180deg);") {
        this.rotateIOS = "transform: rotate(0deg);"
      } else {
        this.rotateIOS = "transform: rotate(180deg);"
      }
    } else {
      console.log("window.screen.orientation.type", window.screen.orientation.type)
      var actualOrientation = window.screen.orientation.type
      const actualOrientationPlugin = await ScreenOrientation.orientation()
      console.log("actualOrientationPlugin", actualOrientationPlugin)
  
      if (actualOrientation == 'portrait-primary') {
        ScreenOrientation.lock({ orientation: 'portrait-secondary' })
      } else {
        ScreenOrientation.lock({ orientation: 'portrait-primary' })
      }
    }
  
  }


  rotateOrientationOLD() {
    // parte con plugin cordova
    console.log("window.screen.orientation.type", window.screen.orientation.type)
    // if (window.screen.orientation.type == "portrait-primary") {
    //   window.screen.orientation.lock('portrait-secondary');
    // } else {
    //   window.screen.orientation.lock('portrait-primary');
    // }

    // parte con plugin capacitor
    // ScreenOrientation.orientation().then(res => {
    //   console.log("ScreenOrientation.orientation", res.type)
    //   if (res.type == "portrait-primary") {
    //     console.log("dentro portrait-primary")
    //     ScreenOrientation.lock({ orientation: 'portrait-secondary' })
    //   } else if (res.type == "portrait-secondary") {
    //     console.log("dentro portrait-secondary")
    //     ScreenOrientation.lock({ orientation: 'portrait-primary' })
    //   } else {
    //     console.log("dentro undefinito")
    //     ScreenOrientation.lock({ orientation: 'portrait-primary' })
    //   }
    // })

    // parte ibrida
    if (window.screen.orientation.type == "portrait-primary") {
      ScreenOrientation.lock({ orientation: 'portrait-secondary' })
    } else {
      ScreenOrientation.lock({ orientation: 'portrait-primary' })
    }

  }
}
