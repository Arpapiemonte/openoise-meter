import { Component, OnInit } from '@angular/core';

import { ActionSheetController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { Share } from '@capacitor/share';

import { ModalController } from '@ionic/angular';
import { ModalComponent } from 'src/app/components/modal/modal.component';

import { FilesystemService } from 'src/app/services/filesystem.service';

import { VariabiliService } from 'src/app/services/variabili.service';
import { InvioDatiService } from 'src/app/services/invio-dati.service';
import { PreferencesService } from 'src/app/services/preferences.service';
//import { Optional } from '@angular/core';
import { Router } from '@angular/router';
//import { IonRouterOutlet } from '@ionic/angular';


@Component({
  selector: 'app-saveddata',
  templateUrl: './saveddata.page.html',
  styleUrls: ['./saveddata.page.scss'],
})
export class SaveddataPage implements OnInit {

  files: any = []
  order = 'desc'

  modificaMoltiVariable: boolean = false

  multiFiles = []

  fileOpen: string = ''
  fileOpenArrayMetadata: any
  fileOpenArrayData: any = []

  viewListLayout = 1
  viewMetadataBoolean = false

  nameFileWritingSubscribe: any

  constructor(
    private modalController: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private alertController: AlertController,
    public filesystemService: FilesystemService,
    public variabiliService: VariabiliService,
    private invioDatiService: InvioDatiService,
    private preferencesService: PreferencesService,
    private router: Router,
    //@Optional() private routerOutlet?: IonRouterOutlet,
  ) { }

  async recuperaFiles() {
    this.files = await this.filesystemService.recuperaFiles()
  }

  invertiOrdine() {
    if (this.order == 'desc') {
      this.order = 'asc'
    } else {
      this.order = 'desc'
    }
    this.files = this.filesystemService.sortFile(this.files, this.order)
  }

  viewMetadata(boolean: boolean) {
    console.log("viewMetadata", boolean)
    this.viewMetadataBoolean = boolean
  }

  blankMetadata(input: string) {
    if (input == "") {
      return "-"
    } else {
      return input
    }
  }

  viewListLayoutFunction() {
    this.viewListLayout++
    if (this.viewListLayout == 4) {
      this.viewListLayout = 1
    }
  }

  async openExternalModal(modalProps: any) {
    console.log("openExternalModal", modalProps)
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: modalProps
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (this.variabiliService.modalData.from === 'metadata') {
      this.saveMetadata(this.variabiliService.modalData.data)
    }
  }



  async presentActionSheet(file: any) {
    var fileName = file.name
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.variabiliService.translation.SAVE_FILES.SAVE_FILES_HEADER,
      subHeader: fileName,
      buttons: [
        {
          text: this.variabiliService.translation.SAVE_FILES.SAVE_FILES_TEXT7,
          icon: 'open-outline',
          data: {
            action: 'open',
          },
          handler: () => {
            console.log("click open")
            this.openExternalModal({ modalType: "measure", "file": file })
          }
        },
        {
          text: this.variabiliService.translation.SAVE_FILES.SAVE_FILES_TEXT9,
          icon: '/assets/icon/pencil.svg',
          data: {
            action: 'rename',
          },
          handler: () => {
            console.log("click rename")
            this.presentAlertRename(this.variabiliService.translation.SAVE_FILES.SAVE_FILES_TEXT10, fileName, "")
          }
        },
        {
          text: this.variabiliService.translation.SAVE_FILES.SAVE_FILES_TEXT11,
          icon: 'create-outline',
          data: {
            action: 'metadata',
          },
          handler: () => {
            console.log("click edit metadata")
            if ("metadata" in file) {
              if ("DESCRIPTION" in file.metadata) {
                this.openExternalModal({ modalType: "metadata", "file": file })
              } else {
                this.presentAlertNoMetadataVersions()
              }
            } else {
              this.presentAlertNoMetadataVersions()
            }
          }
        },
        {
          text: this.variabiliService.translation.SAVE_FILES.SAVE_FILES_TEXT5,
          icon: 'share-social-outline',
          data: {
            action: 'share',
          },
          handler: () => {
            console.log("click share")
            this.shareFile([fileName])
          }
        },
        {
          text: this.variabiliService.translation.SAVE_FILES.SAVE_FILES_TEXT4,
          role: 'destructive',
          icon: 'trash-outline',
          data: {
            action: 'delete',
          },
          handler: () => {
            console.log("click delete")
            this.presentAlertDelete(
              this.variabiliService.translation.SAVE_FILES.SAVE_FILES_TEXT4_2 + ':',
              '',
              fileName,
              [fileName]
            )
          }
        },
        {
          text: this.variabiliService.translation.SAVE_FILES.SAVE_FILES_TEXT6,
          role: 'cancel',
          icon: 'close-outline',
          data: {
            action: 'cancel',
          },
          handler: () => {
            console.log("click cancel")
          }
        },
      ],
    });

    await actionSheet.present();

    // const result = await actionSheet.onDidDismiss();
    // console.log("result actionSheetCtrl", result)
    // console.log("result actionSheetCtrl", JSON.stringify(result, null, 2))
  }

  async presentAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentAlertDelete(header: string, subHeader: string, message: string, arrayFiles: Array<any>) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [
        {
          text: this.variabiliService.translation.SAVE_FILES.SAVE_FILES_TEXT6,
          role: 'cancel',
          handler: () => {
            console.log("presentAlertDelete cancel")
            this.annulla()
          }
        },
        {
          text: 'OK',
          handler: () => {
            for (let fileName of arrayFiles) {
              this.filesystemService.deleteFile(fileName)
            }
            this.recuperaFiles()
            this.modificaMoltiVariable = false
            this.multiFiles = []
          }
        },
      ],
    });

    await alert.present();
  }

  async presentAlertRename(header: string, filename: string, message: string) {
    var ext = filename.slice(-4)
    var filename_no_ext = filename.slice(0, -4)
    const alert = await this.alertController.create({
      // mode: 'ios',
      header: header,
      subHeader: filename,
      message: message,
      buttons: [
        {
          text: this.variabiliService.translation.SAVE_FILES.SAVE_FILES_TEXT6,
          role: 'cancel',
          handler: () => [

          ]
        },
        {
          text: 'OK',
          handler: (res) => {
            console.log("rename", res)
            this.filesystemService.renameFile(filename, res[0] + ext)
            this.recuperaFiles()
          }
        },
      ],
      inputs: [
        {
          value: filename_no_ext,
        },
      ]
    });

    await alert.present();
  }


  async presentAlertControlSendCal() {
    var this_copy = this
    const alert = await this.alertController.create({
      header: this.variabiliService.translation.SETTINGS.SEND_CALIBDATA.SEND_CALIBDATA_ATTENTION,
      subHeader: "",
      message: this.variabiliService.translation.SETTINGS.SEND_CALIBDATA.SEND_CALIBDATA_NO_CALIBRATION,
      buttons: [
        {
          text: 'OK',
          handler() {
            console.log("Calibrazione non inviata")
            this_copy.router.navigate(['/pages/tabs/settings'])
          },
        }
      ]
    });
    await alert.present();
  }

  async presentAlertControlPrivacy() {
    var this_copy = this
    const alert = await this.alertController.create({
      header: this.variabiliService.translation.SETTINGS.SEND_CALIBDATA.SEND_CALIBDATA_ATTENTION,
      subHeader: "",
      message: this.variabiliService.translation.SETTINGS.SEND_CALIBDATA.SEND_CALIBDATA_NO_PRIVACY,
      buttons: [
        {
          text: 'OK',
          handler() {
            console.log("Informativa privacy non letta")
            this_copy.router.navigate(['/pages/tabs/info'], {
              queryParams: {
                value: 'PRIVACY'
              },
            })
          },
        }
      ]
    });
    await alert.present();
  }

  async presentAlertNoMetadataVersions() {
    const alert = await this.alertController.create({
      header: this.variabiliService.translation.SETTINGS.SEND_CALIBDATA.SEND_CALIBDATA_ATTENTION,
      subHeader: "",
      message: this.variabiliService.translation.SETTINGS.SEND_CALIBDATA.SEND_CALIBDATA_NO_METADATA_OLD_VERSIONS,
      buttons: [
        {
          text: 'OK',
          handler() {
            console.log("Old version app, no metadata")
          },
        }
      ]
    });
    await alert.present();
  }

  async presentAlertControlEditMetadata(file: any) {
    var this_copy = this
    const alert = await this.alertController.create({
      header: this.variabiliService.translation.SETTINGS.SEND_CALIBDATA.SEND_CALIBDATA_ATTENTION,
      subHeader: "",
      message: this.variabiliService.translation.SETTINGS.SEND_CALIBDATA.SEND_CALIBDATA_NO_METADATA,
      buttons: [
        {
          text: 'OK',
          handler(data: String) {
            console.log("Dati utenti da compilare")
            this_copy.openExternalModal({ modalType: "metadata", "file": file })
          },
        }
      ]
    });
    await alert.present();
  }


  async shareFile(arrayFiles: Array<any>) {

    let arrayFilesUrls: string[] = []
    let string = ''
    for (let file of arrayFiles) {
      let url = await this.filesystemService.getUrl(file)
      arrayFilesUrls.push(url.uri)
      string = string + ' ' + url.uri
    }

    console.log("arrayFilesUrls", arrayFilesUrls)

    try {
      await Share.share({
        title: this.variabiliService.translation.SAVE_FILES.SHARE_TITLE,
        text: this.variabiliService.translation.SAVE_FILES.SHARE_TEXT + String(arrayFiles),
        files: arrayFilesUrls,
        dialogTitle: this.variabiliService.translation.SAVE_FILES.SHARE_BUDDIES,
      });
    } catch (err) {
      console.log("Share err", err)
    }

  }

  modificaMolti() {
    this.modificaMoltiVariable = true
  }

  checkboxTutti(ev: any) {
    console.log("checkboxTutti", ev.detail.checked)

    this.multiFiles = []
    for (let file of this.files) {
      file.checked = ev.detail.checked
      this.multiFiles.push(file.name)
    }

  }

  eliminaMolti() {
    if (this.multiFiles.length > 0) {
      let string = ''
      for (let file of this.multiFiles) {
        string = string + file + '<br>'
      }

      this.presentAlertDelete(
        this.variabiliService.translation.SAVE_FILES.SAVE_FILES_TEXT4_2b + ':',
        '',
        string,
        this.multiFiles
      )

    } else {
      this.presentAlert(this.variabiliService.translation.SAVE_FILES.SAVE_FILES_TEXT4_2cA, '', this.variabiliService.translation.SAVE_FILES.SAVE_FILES_TEXT4_2cB)
    }

  }

  condividiMolti() {
    if (this.multiFiles.length > 0) {
      this.shareFile(this.multiFiles)
      this.modificaMoltiVariable = false
      this.multiFiles = []
    } else {
      this.presentAlert(this.variabiliService.translation.SAVE_FILES.SAVE_FILES_TEXT4_2cA, '', this.variabiliService.translation.SAVE_FILES.SAVE_FILES_TEXT4_2cB)
    }
  }

  annulla() {
    console.log("annulla")
    if (this.modificaMoltiVariable) {
      console.log("annulla if modificaMoltiVariable true")
      this.modificaMoltiVariable = false
      this.multiFiles = []
      for (let file of this.files) {
        file.checked = false
      }
    } else {
      this.modificaMoltiVariable = true
    }
  }

  checkboxChange(fileName: string, ev: any) {
    console.log("checkboxChange", fileName, ev.detail.checked)

    const index = this.multiFiles.indexOf(fileName);
    if (ev.detail.checked) {
      if (index < 0) {
        this.multiFiles.push(fileName)
      }
    } else {
      if (index > -1) { // only splice array when item is found
        this.multiFiles.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
    console.log("this.multiFiles", this.multiFiles)

  }

  async saveMetadata(file: any) {
    console.log("saveMetadata file", file)
    var res = await this.filesystemService.readFile(file.name)
    console.log("saveMetadata res", res)
    var contentSplit = String(res.data).split('===')
    var newMetadata = ""
    for (let m in this.variabiliService.translation.SAVE_FILES.METADATA) {
      newMetadata = newMetadata + this.variabiliService.translation.SAVE_FILES.METADATA[m] + ": " + file.metadata[m] + "\n"
    }
    console.log("newMetadata", newMetadata)
    await this.filesystemService.writeFile(
      file.name,
      newMetadata + "===\n" + contentSplit[1]
    )
    this.recuperaFiles()
  }

  async sendDataMeasurement(file: any) {
    console.log("sendDataMeasurement file", file)

    if (this.variabiliService.metadataFromLabelToValue(file.metadata.CLOUD).value == 'cloud-false') {
      // metterei solo i controlli e gli alert relativi
      if (this.variabiliService.privacyAccepted == true) {
        if (this.variabiliService.calibrationCloud == true) {
          // if sui metadati
          if (file.metadata.DESCRIPTION != "" && file.metadata.TYPE != "" && file.metadata.ENVIRONMENT != "" && file.metadata.SOURCE != "" && file.metadata.WEATHER != "" && file.metadata.WHYTAKENOISE != "" && this.variabiliService.metadataFromLabelToValue(file.metadata.FEELING).value != "-1" && this.variabiliService.metadataFromLabelToValue(file.metadata.APPROPRIATE).value != "-1") {
            // se tutto ok si fa qui:
            var measurementCloud = await this.invioDatiService.sendData(this.variabiliService.userData, this.variabiliService.calibData, file.metadata)
            console.log("measurementCloud", measurementCloud)
            if (measurementCloud) {
              file.metadata.CLOUD = this.variabiliService.metadataFromValueToLabel('cloud-true').label
            } else {
              file.metadata.CLOUD = this.variabiliService.metadataFromValueToLabel('cloud-false').label
            }
            this.saveMetadata(file)
          } else {
            // alert con testo: devi prima compilare gli user data
            this.presentAlertControlEditMetadata(file)
          }
        } else {
          // alert con testo: devi prima inviare la calibrazione e compilare gli user data
          this.presentAlertControlSendCal()
        }
      } else {
        // alert con testo: devi prima inviare la calibrazione e compilare gli user data
        this.presentAlertControlPrivacy()
      }
    }

  }


  async inizializzaPage() {
    const permissions = await this.filesystemService.checkRequestPermissions()
    if (permissions == "granted") {
      this.recuperaFiles()
    }
  }

  ionViewWillEnter() {
    console.log("SaveddataPage ionViewWillEnter")
    this.inizializzaPage()
    this.nameFileWritingSubscribe = this.filesystemService.getNameFileWritingS().subscribe(val => {
      console.log("nameFileWritingSubscribe", val)
      this.inizializzaPage()
    })
  }

  ionViewWillLeave() {
    console.log("SaveddataPage ionViewWillLeave")
    this.modificaMoltiVariable = false
    if (this.nameFileWritingSubscribe) this.nameFileWritingSubscribe.unsubscribe()
  }

  ngOnInit() {
    console.log("PASS")
  }

}
