import { Injectable } from '@angular/core';

import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

import { VariabiliService } from './variabili.service';

import * as moment from 'moment'
import 'moment/locale/it'

@Injectable({
  providedIn: 'root'
})
export class FilesystemService {

  directory = Directory.Documents

  directoryOpeNoise: string = 'opeNoise/'

  saveData: boolean = false
  nameFileWriting: string

  constructor(
    private variabiliService: VariabiliService
  ) { }

  inizializeFile() {
    // console.log("inizializeFile")
    var intestazioneArray: Array<any> = [16, 20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500,
      630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000];

    var intestazione = 'Date' + this.variabiliService.saveOptions.field + 'Time' + this.variabiliService.saveOptions.field + 'LAeq(t)' + this.variabiliService.saveOptions.field + 'LAeq(1s)' //+ this.variabiliService.saveOptions.field + 'LAeq(t)2'

    if (this.variabiliService.saveOptions.bandLZeq) {
        intestazione = intestazione  + this.variabiliService.saveOptions.field + 'LZeq(t)'
        intestazione = intestazione  + this.variabiliService.saveOptions.field + 'LZeq(1s)'
      for (let el of intestazioneArray) {
        intestazione = intestazione + this.variabiliService.saveOptions.field + 'LZeq_' + el
      }
    }
    if (this.variabiliService.saveOptions.bandLZmin) {
      for (let el of intestazioneArray) {
        intestazione = intestazione + this.variabiliService.saveOptions.field + 'LZmin_' + el
      }
    }

    this.nameFileWriting = moment(new Date()).format("YYYY-MM-DD-HHmmss") + ".txt"
    this.writeFile(
      this.nameFileWriting,
      intestazione
    )
  }

  async writeFile(nameFile: any, data: any) {
    // console.log("writeFile", nameFile)
    try {
      const result = await this.readDir(this.directoryOpeNoise)
      if (!result) {
        console.log("creo la directory")
        this.mkDir(this.directoryOpeNoise)
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





}
