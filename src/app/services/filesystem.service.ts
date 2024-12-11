import { Injectable } from '@angular/core';

import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
//import { Geolocation } from '@capacitor/geolocation';
import { Subject } from 'rxjs';

import { AlertController } from '@ionic/angular'

import { VariabiliService } from './variabili.service';

import * as moment from 'moment'
import 'moment/locale/it'

@Injectable({
  providedIn: 'root'
})
export class FilesystemService {
  public nameFileWritingS: Subject<string> = new Subject();

  directoryOLD = Directory.Documents
  directory = Directory.Cache

  directoryOpeNoise: string = 'opeNoiseMeasures/'

  saveData: boolean = false
  saveDataStart: boolean = false
  nameFileWriting: string

  constructor(
    private alertController: AlertController,
    private variabiliService: VariabiliService
  ) {
  }

  setNameFileWritingS(value: any) {
    this.nameFileWritingS.next(value)
  }

  getNameFileWritingS() {
    return this.nameFileWritingS.asObservable();
  }

  async checkRequestPermissions() {
    console.log("checkRequestPermissions")

    var output = "denied"

    const checkRequestPermissions = await Filesystem.checkPermissions()
    console.log("checkRequestPermissions", checkRequestPermissions)

    if (checkRequestPermissions.publicStorage == "granted") {
      output = "granted"
    } else {
      console.log("checkRequestPermissions if not granted")

      const requestPermissions = await Filesystem.requestPermissions()
      console.log("requestPermissions", requestPermissions)

      if (requestPermissions.publicStorage == "granted") {
        output = "granted"
      }
    }

    return Promise.resolve(output)

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

  async inizializeFile() {
    // console.log("inizializeFile")

    this.nameFileWriting = moment(new Date()).format("YYYY-MM-DD-HHmmss") + this.variabiliService.saveOptions.extension
    this.setNameFileWritingS(this.nameFileWriting)
    await this.writeFile(
      this.nameFileWriting,
      this.creaIntestazioneDati()
    )
  }

  async writeMetadataFirstTime(lastData: any) {

    var lat: any = "LATITUDE"
    var lon: any = "LONGITUDE"

    var metadati = ""
    for (let m in this.variabiliService.translation.SAVE_FILES.METADATA) {
      var label = this.variabiliService.translation.SAVE_FILES.METADATA[m]
      if (m == "COORDINATES") {
        metadati = metadati + label + ": " + lat + ', ' + lon + ' \n'
      } else if (m == "CALIBRATION") {
        metadati = metadati + label + ": " + this.variabiliService.dbGain + ' dBA \n'
      } else if (m == "MEASURE_START") {
        metadati = metadati + label + ": " + lastData.START_DATE + ' ' + lastData.START_TIME + ' \n'
      } else if (m == "MEASURE_STOP") {
        metadati = metadati + label + ": " + lastData.LAST_DATE + ' ' + lastData.LAST_TIME + ' \n'
      } else if (m == "MEASURE_DURATION") {
        metadati = metadati + label + ": " + lastData.DURATION + ' \n'
      } else if (m == "LAEQ") {
        metadati = metadati + label + ": " + lastData.LAST_LAEQT + ' dBA \n'
      } else if (m == "FEELING") {
        metadati = metadati + label + ": " + this.variabiliService.metadataFromValueToLabel(-1).label + " \n"
      } else if (m == "APPROPRIATE") {
        metadati = metadati + label + ": " + this.variabiliService.metadataFromValueToLabel(-1).label + " \n"
      } else if (m == "CLOUD") {
        metadati = metadati + label + ": " + this.variabiliService.metadataFromValueToLabel('cloud-false').label + " \n"
      } else {
        metadati = metadati + label + ": " + ' \n'
      }
    }
    metadati = metadati + '===\n'

    var content = await this.readFile(this.nameFileWriting)

    // writeFile without position
    await this.writeFile(
      this.nameFileWriting,
      metadati + String(content.data)
    )

    // check and write position
    var cooordinatesLatLon: any
    cooordinatesLatLon = await this.variabiliService.getLocPosition()
    lat = cooordinatesLatLon.lat
    lon = cooordinatesLatLon.lon

    await this.writeFile(
      this.nameFileWriting,
      metadati.replace("LATITUDE", lat).replace("LONGITUDE", lon) + String(content.data)
    )
    this.nameFileWriting = ""
    this.setNameFileWritingS("")
  }

  creaIntestazioneDati() {
    var intestazioneArray: Array<any> = [16, 20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500,
      630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000];

    var intestazione = 'Date' + this.variabiliService.saveOptions.field + 'Time' + this.variabiliService.saveOptions.field + 'LAeq(t)' + this.variabiliService.saveOptions.field + 'LAeq(1s)' + this.variabiliService.saveOptions.field + 'Marker' //+ this.variabiliService.saveOptions.field + 'LAeq(t)2'

    if (this.variabiliService.saveOptions.debug) {
      intestazione = intestazione + this.variabiliService.saveOptions.field + 'Time (ms)'
      intestazione = intestazione + this.variabiliService.saveOptions.field + 'Count (s)'
      intestazione = intestazione + this.variabiliService.saveOptions.field + 'N_FFT_s'
      intestazione = intestazione + this.variabiliService.saveOptions.field + 'N_FFT_TOT'
      intestazione = intestazione + this.variabiliService.saveOptions.field + 'LAeq(s)_linear'
    }
    if (this.variabiliService.saveOptions.bandLZeq) {
      intestazione = intestazione + this.variabiliService.saveOptions.field + 'LZeq(t)'
      intestazione = intestazione + this.variabiliService.saveOptions.field + 'LZeq(1s)'
      for (let el of intestazioneArray) {
        intestazione = intestazione + this.variabiliService.saveOptions.field + 'LZeq_' + el
      }
    }
    if (this.variabiliService.saveOptions.bandLZmin) {
      for (let el of intestazioneArray) {
        intestazione = intestazione + this.variabiliService.saveOptions.field + 'LZmin_' + el
      }
    }

    return intestazione
  }

  async writeFile(nameFile: any, data: any) {
    // console.log("writeFile", nameFile)
    try {
      const result = await this.readDir(this.directoryOpeNoise)
      if (!result) {
        console.log("creo la directory")
        await this.mkDir(this.directoryOpeNoise)
      }

      await Filesystem.writeFile({
        path: this.directoryOpeNoise + nameFile,
        data: data + '\n',
        directory: this.directory,
        encoding: Encoding.UTF8,
      });
    } catch (err) {
      console.log("writeFile error", err)
    }


  }

  async appendFile(nameFile: any, data: any) {
    await Filesystem.appendFile({
      path: this.directoryOpeNoise + nameFile,
      data: data + '\n',
      directory: this.directory,
      encoding: Encoding.UTF8,
    });
  }

  async mkDir(nameDir: string) {
    var mkDir = await Filesystem.mkdir({
      path: nameDir,
      directory: this.directory,
    })
    console.log("mkDir", mkDir)

  }

  async readDir(nameDir: string) {

    try {
      var readDir = await Filesystem.readdir({
        path: nameDir,
        directory: this.directory,
      });
      console.log("readDir", readDir)
      // this.variabiliService.filesList = readDir.files
      return Promise.resolve(readDir.files)
    } catch (err) {
      console.log("readDir err", err)
      return Promise.resolve(false)
    }

  }

  async readFile(nameFile: any) {
    const contents = await Filesystem.readFile({
      path: this.directoryOpeNoise + nameFile,
      directory: this.directory,
      encoding: Encoding.UTF8,
    });

    return Promise.resolve(contents)
  }

  async deleteFile(nameFile: any) {
    const contents = await Filesystem.deleteFile({
      path: this.directoryOpeNoise + nameFile,
      directory: this.directory
    });

    return Promise.resolve(contents)
  }

  async renameFile(nameFileOld: string, fileNameNew: any) {
    const contents = await Filesystem.rename({
      from: this.directoryOpeNoise + nameFileOld,
      to: this.directoryOpeNoise + fileNameNew,
      directory: this.directory,
      toDirectory: this.directory,
    });
    return Promise.resolve(contents)
  }


  async getUrl(nameFile: any) {
    const url = await Filesystem.getUri({
      path: this.directoryOpeNoise + nameFile,
      directory: this.directory,
    });

    return Promise.resolve(url)
  }

  async checkPermessi() {
    var permissions = await Filesystem.checkPermissions()
    console.log("permissions", permissions)
    if (permissions.publicStorage == 'granted') {
      console.log("permission.publicStorage granted!")
    } else {
      console.log("permission.publicStorage NOT granted!")
      await Filesystem.requestPermissions()
      var permissions2 = await Filesystem.checkPermissions()
      console.log("permissions2", permissions2)
      if (permissions2.publicStorage == 'granted') {
        console.log("permission2.publicStorage granted!")
      } else {
        console.log("permission2.publicStorage NOT granted!")
      }
    }
  }


  async recuperaFiles() {
    let files: any = await this.readDir(this.directoryOpeNoise)
    console.log("files", files)

    var filesOutput = []
    var now = moment()
    // console.log("now", now)
    if (files) {
      for (let file of files) {
        file["size_kb"] = (file.size / 1000).toFixed(0)
        file["checked"] = false
        file["data_label"] = this.formatDate(Number(file.ctime))
        var time = this.differenzaTempi(now, Number(file.ctime))
        file["diff"] = time.diff
        file["diff_label"] = time.diff_label
        file["metadata"] = await this.getMetadata(file.name)
        filesOutput.push(file)
      }
    }

    return Promise.resolve(this.sortFile(filesOutput, 'desc'))

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

  async getMetadata(fileName: string) {
    var res = await this.readFile(fileName)
    // console.log("getMetadata res", res)
    var lineArray = String(res.data).split('\n')
    // console.log("getMetadata lineArray", lineArray)
    var output: any
    if (String(res.data).indexOf("Descrizione:") == 0 || String(res.data).indexOf("Description:") == 0) {
      // console.log("getMetadata with metadata")
      var coordinate: any = lineArray[8].substring(lineArray[8].indexOf(": ") + 2).trim().split(",")
      if (isNaN(coordinate[0])) {
        coordinate = [coordinate[0], coordinate[1]]
      } else {
        coordinate = [Number(coordinate[0]), Number(coordinate[1])]
      }

      output = {}
      var i = 0
      for (let m in this.variabiliService.translation.SAVE_FILES.METADATA) {
        if (m == "COORDINATES") {
          output[m] = coordinate
        } else {
          output[m] = lineArray[i].substring(lineArray[i].indexOf(": ") + 2).trim()
        }
        i++
      }

    } else {
      // console.log("getMetadata without metadata")

      output = {}
      // var i = 0
      // for (let m in this.variabiliService.translation.SAVE_FILES.METADATA) {
      //   output[m] = "-"
      //   i++
      // }

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

  async folderChange() {

    try {
      const contents = await Filesystem.copy({
        from: 'opeNoise/',
        to: this.directoryOpeNoise,
        directory: this.directoryOLD,
        toDirectory: this.directory,
      });
      console.log("folderChange copy", contents)
    } catch (err) {
      console.log("folderChange err", err)
    }

  }

}
