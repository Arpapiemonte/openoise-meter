import { Component, OnInit } from '@angular/core';

import { ActionSheetController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { Share } from '@capacitor/share';

import { FilesystemService } from 'src/app/services/filesystem.service';

import { VariabiliService } from 'src/app/services/variabili.service';


@Component({
  selector: 'app-saveddata',
  templateUrl: './saveddata.page.html',
  styleUrls: ['./saveddata.page.scss'],
})
export class SaveddataPage implements OnInit {

  files: any = []

  modificaMoltiVariable: boolean = false

  multiFiles = []

  isModalOpen: boolean = false
  fileOpen: string = ''
  fileOpenArray: any

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private alertController: AlertController,
    public filesystemService: FilesystemService,
    public variabiliService: VariabiliService,
  ) { }

  async recuperaFiles() {
    let files: any = await this.filesystemService.readDir(this.filesystemService.directoryOpeNoise)
    console.log("files", files)

    this.files = []
    for (let file of files) {
      if (file.name.includes(".txt")) {
        file["size_kb"] = (file.size / 1000).toFixed(0)
        file["checked"] = false
        this.files.push(file)
      }

    }
  }

  async presentActionSheet(fileName: string) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.variabiliService.translation.SAVE_FILES.SAVE_FILES_HEADER,
      subHeader: fileName,
      buttons: [
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
          text: this.variabiliService.translation.SAVE_FILES.SAVE_FILES_TEXT7,
          icon: 'open-outline',
          data: {
            action: 'open',
          },
          handler: () => {
            console.log("click open")
            this.setModalOpen(true)
            this.fileOpen = fileName
            this.filesystemService.readFile(fileName).then(res => {
              console.log("readFile res", res)
              // this.fileOpenArray = res.data.replace(';',' ').split("\n")
              this.fileOpenArray = res.data.split("\n")
            })
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
          handler: () => [

          ]
        },
        {
          text: 'OK',
          handler: () => {
            for (let fileName of arrayFiles) {
              this.filesystemService.deleteFile(fileName)
            }

            this.recuperaFiles()
          }
        },
      ],
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
        title: 'OpeNoise: condivizione misura',
        text: 'In allegato le seguenti misure: ' + String(arrayFilesUrls),
        files: arrayFilesUrls,
        dialogTitle: 'Share with buddies',
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

      this.modificaMoltiVariable = false
      this.multiFiles = []

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
    if (this.modificaMoltiVariable) {
      this.modificaMoltiVariable = false
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

  setModalOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  ionViewWillEnter() {
    console.log("SaveddataPage ionViewWillEnter")
    this.recuperaFiles()
  }

  ionViewWillLeave() {
    console.log("SaveddataPage ionViewWillLeave")
    this.modificaMoltiVariable = false
  }

  ngOnInit() {

  }

}
