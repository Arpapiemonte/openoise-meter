import { Component, OnInit } from '@angular/core';

import { ActionSheetController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { Share } from '@capacitor/share';

import { FilesystemService } from 'src/app/services/filesystem.service';

import { VariabiliService } from 'src/app/services/variabili.service';
import * as moment from 'moment';


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
    var now = moment()
    console.log("now", now)
    for (let file of files) {
      file["size_kb"] = (file.size / 1000).toFixed(0)
      file["checked"] = false
      file["data_label"] = this.formatDate(Number(file.mtime))
      var time = this.differenzaTempi(now, Number(file.mtime))
      file["diff"] = time.diff
      file["diff_label"] = time.diff_label
      this.files.push(file)
    }

    this.files = this.sortFile(this.files, this.order)
  }

  formatDate(date: any) {
    var output = ''
    if (date != '' && this.variabiliService.language === 'en') {
      moment.locale('en-GB');
      output = moment(date).format("MM/DD/YYYY HH:mm")
    } else {
      if (date != '' && this.variabiliService.language === 'it') {
        moment.locale('it-IT');
        output = moment(date).format("DD/MM/YYYY HH:mm")
      }
    }
    return output
  }

  sortFile(files: any, order: string) {
    files.sort(function (a, b) {
      var x = a.diff;
      var y = b.diff;
      if (order == 'asc') {
        if (x > y) { return -1; }
        if (x < y) { return 1; }
        return 0;
      } else {
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;
      }
    });
    return files
  }

  invertiOrdine() {
    if (this.order == 'desc') {
      this.order = 'asc'
    } else {
      this.order = 'desc'
    }
    this.files = this.sortFile(this.files, this.order)
  }

  differenzaTempi(time1: any, time2: any) {

    var output = {
      'diff': '',
      'diff_label': ''
    }

    var giorni = time1.diff(moment(time2), 'days')
    var ore = time1.diff(moment(time2), 'hours')
    var minuti = time1.diff(moment(time2), 'minutes')

    output.diff = time1.diff(moment(time2))

    if (giorni > 0) {
      output.diff_label = giorni + this.variabiliService.translation.SAVE_FILES.SAVE_FILES_TIME1
    } else if (ore > 0) {
      output.diff_label = ore + this.variabiliService.translation.SAVE_FILES.SAVE_FILES_TIME2
    } else if (minuti >= 0) {
      output.diff_label = minuti + this.variabiliService.translation.SAVE_FILES.SAVE_FILES_TIME3
    }

    if (giorni == 1) {
      output.diff_label = giorni + this.variabiliService.translation.SAVE_FILES.SAVE_FILES_TIME1s
    } else if (ore == 1) {
      output.diff_label = ore + this.variabiliService.translation.SAVE_FILES.SAVE_FILES_TIME2s
    } else if (minuti == 1) {
      output.diff_label = minuti + this.variabiliService.translation.SAVE_FILES.SAVE_FILES_TIME3s
    }

    return output

  }

  async presentActionSheet(fileName: string) {
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
            this.setModalOpen(true)
            this.fileOpen = fileName
            this.filesystemService.readFile(fileName).then(res => {
              console.log("readFile res", res)
              // this.fileOpenArray = res.data.replace(';',' ').split("\n")
              this.fileOpenArray = String(res.data).split("\n")
            })
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
            this.filesystemService.renameFile(filename, res[0])
            this.recuperaFiles()
          }
        },
      ],
      inputs: [
        {
          value: filename,
        },
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

  setModalOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
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
  }

  ionViewWillLeave() {
    console.log("SaveddataPage ionViewWillLeave")
    this.modificaMoltiVariable = false
  }

  ngOnInit() {

  }

}
