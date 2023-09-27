import { Component } from '@angular/core';
import { NgZone } from '@angular/core';
import { Optional } from '@angular/core';
import { Router } from '@angular/router';

import { IonRouterOutlet } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular'
import { ToastController } from '@ionic/angular';

import { App } from '@capacitor/app';

import { VariabiliService } from 'src/app/services/variabili.service';
import { AudioService } from '../../services/audio.service';
import { FilesystemService } from 'src/app/services/filesystem.service';

@Component({
  selector: 'app-noisemeter',
  templateUrl: 'noisemeter.page.html',
  styleUrls: ['noisemeter.page.scss']
})
export class NoisemeterPage {

  audioSubscribe: any

  nameFile: string = ''

  playStatic: Boolean = true

  markerStatus: Boolean = false

  countdownBoolean: boolean = false
  countdownNumberLocal: any
  countdownInterval: any

  constructor(
    private zone: NgZone,
    private router: Router,
    public platform: Platform,
    private alertController: AlertController,
    private toastController: ToastController,
    public variabiliService: VariabiliService,
    public audioService: AudioService,
    public filesystemService: FilesystemService,
    @Optional() private routerOutlet?: IonRouterOutlet,
  ) {

    this.platform.backButton.subscribeWithPriority(-1, () => {
      console.log("backButton")
      if (!this.routerOutlet.canGoBack()) {
        console.log("this.router.url", this.router.url)
        if (this.router.url == '/pages/tabs/noisemeter') {
          console.log("backButton exitApp")
          App.exitApp();
        } else {
          this.router.navigate(['/pages/tabs/noisemeter'])
        }
      }
    });

  }

  startCapture() {
    if (!this.audioService.capture) {
      this.audioService.reset()
      this.startCaptureWithCountdown()
    } else {
      this.audioService.startPauseCapture()
    }
  }

  pauseCapture() {
    if (this.audioService.capture) {
      this.audioService.startPauseCapture()
    }
  }

  startPauseCapture() {
    console.log("startPauseCapture")

    if (!this.audioService.capture) {
      this.audioService.startAudio()
      if (this.filesystemService.saveData) {
        this.initializeFile()
      }
    } else {
      this.audioService.startPauseCapture()
    }
  }

  stopCapture() {
    if (this.audioService.capture) {
      this.audioService.stopCapture()
      this.playStatic = true
      this.markerStatus = false
      if (this.filesystemService.saveData) {
        this.presentAlert(
          this.variabiliService.translation.SAVE_FILES.SAVE_BUTTON.SAVE_BUTTON_TEXT1,
          '',
          this.filesystemService.nameFileWriting
        )
      }
    } else if (this.countdownNumberLocal > 0) {
      clearInterval(this.countdownInterval)
      this.countdownBoolean = false
    }
  }

  reset() {
    if (!this.audioService.capture) {
      this.presentAlert(
        this.variabiliService.translation.SAVE_FILES.SAVE_BUTTON.SAVE_BUTTON_TEXT2,
        '',
        this.variabiliService.translation.SAVE_FILES.SAVE_BUTTON.SAVE_BUTTON_TEXT3
      )
    } else {

    }
  }

  async toggleChangeSave() {
    console.log("toggleChangeSave")

    const permissions = await this.filesystemService.checkRequestPermissions()
    if (permissions == "granted") {
      if (this.filesystemService.saveData) {
        if (this.audioService.capture) { 
          this.audioService.writeStatus('STOP')
        }
        this.filesystemService.saveData = false
        this.audioService.marker = false
        this.markerStatus = false
        if (this.audioService.capture) {
          this.presentAlert(
            this.variabiliService.translation.SAVE_FILES.SAVE_BUTTON.SAVE_BUTTON_TEXT1,
            '',
            this.filesystemService.nameFileWriting
          )
        } else {
          this.presentToast(this.variabiliService.translation.SAVE_FILES.SAVE_BUTTON.SAVE_BUTTON_TEXT5)
        }
      } else {
        this.filesystemService.saveData = true
        if (this.audioService.capture) {
          this.initializeFile()
        } else {
          this.presentToast(this.variabiliService.translation.SAVE_FILES.SAVE_BUTTON.SAVE_BUTTON_TEXT4)
        }
      }
    }

  }

  async initializeFile() {
    await this.filesystemService.inizializeFile()
    this.filesystemService.saveDataStart = true

    this.presentToast(
      this.variabiliService.translation.SAVE_FILES.SAVE_BUTTON.SAVE_BUTTON_TEXT6 + this.filesystemService.nameFileWriting
    )
  }

  appendFile() {
    this.filesystemService.appendFile(
      this.nameFile,
      'questi sono i miei dati seconda riga'
    )
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

  async presentToast(message: string) {
    console.log("presentToast", message)
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'middle',
      cssClass: 'toastClass'
    });

    await toast.present();
  }

  startCaptureWithCountdown() {
    console.log("startCaptureWithCountdown", this.variabiliService.countdownNumber)
    this.countdownNumberLocal = Number(this.variabiliService.countdownNumber)
    console.log("countdownNumberLocal", this.countdownNumberLocal)

    if (this.countdownNumberLocal > 0) {
      this.countdownBoolean = true
      var this_copy = this
      this.countdownInterval = setInterval(function () {
        console.log("countdownNumberLocal", this_copy.countdownNumberLocal)
        this_copy.countdownNumberLocal = this_copy.countdownNumberLocal - 1
        if (this_copy.countdownNumberLocal == 0) {
          clearInterval(this_copy.countdownInterval)
          this_copy.countdownBoolean = false
          this_copy.audioService.startAudio()
          if (this_copy.filesystemService.saveData) {
            this_copy.initializeFile()
          }
        }
      }, 1000)
    } else {
      this.audioService.startAudio()
      if (this.filesystemService.saveData) {
        this.initializeFile()
      }
    }
  }

  autoStart() {
    this.platform.ready().then((readySource) => {
      console.log("platform ready", readySource)
      if (this.variabiliService.firstTime) {
        this.startCaptureWithCountdown()
        this.variabiliService.firstTime = false
      }
    })
  }

  startStopMarker() {
    if (this.filesystemService.saveData) {
      console.log('click start Marker!')
      if (this.audioService.marker) {
        this.audioService.marker = false
        this.markerStatus = false
      } else {
        this.audioService.marker = true
        this.markerStatus = true
      }
    }
  }

  ionViewWillEnter() {
    console.log("NoisemeterPage ionViewWillEnter")
    this.audioSubscribe = this.variabiliService.getDataRefreshBS().subscribe(val => {
      console.log('HomePage getDataRefreshBS subscribe', val)
      if (this.audioService.pause) {
        console.log("playStatic", this.playStatic)
        if (this.playStatic) {
          this.playStatic = false
        } else {
          this.playStatic = true
        }
      }

      if (this.audioService.marker) {
        console.log("markerStatus: ", this.markerStatus)
        if (this.markerStatus) {
          this.markerStatus = false
        } else {
          this.markerStatus = true
        }
      }

      this.zone.run(() => {
        console.log('force update the screen');
      });
    })
  }

  ionViewDidEnter() {
    console.log("NoisemeterPage ionViewDidEnter")
    this.autoStart()

  }

  ionViewWillLeave() {
    console.log("NoisemeterPage ionViewWillLeave")
    this.audioSubscribe.unsubscribe()
  }
  ionViewDidLeave() {
    console.log("NoisemeterPage ionViewDidLeave")
  }

  ngOnDestroy() {
    console.log("NoisemeterPage ionViewWillEnter")
  }

  ngOnInit() {
    console.log("NoisemeterPage ngOnInit")
  }

}
