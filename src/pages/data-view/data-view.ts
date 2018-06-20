import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import { AppPreferences } from '@ionic-native/app-preferences';

import { File } from '@ionic-native/file';

import { DataListPage } from '../data-list/data-list';


@Component({
  templateUrl: 'data-view.html'
})
export class DataViewPage {

  fileToView:any;
  fileRead:any;

  dirPath;
  fileName;

  calibration: number = 0;

  constructor(public navCtrl: NavController, navParams: NavParams, private appPreferences: AppPreferences,
              public platform: Platform, private file: File
              ) {



    var this_copy = this;

    var fileToViewObject = navParams.get('fileToView')

    this.fileName = fileToViewObject.name;

    this_copy.fileToView = this.fileName;

    this.appPreferences.fetch('storageSettings').then((res) => {

      this_copy.dirPath = res.dirPath;

      file.readAsText(this_copy.dirPath, this.fileName)
              .then(string => {var a  = string.split("\n");
                              this_copy.fileRead = a;
                              })

      });

  }

  ionViewWillEnter() {
    // back button to DataListPage
    this.platform.registerBackButtonAction(() => {
        this.navCtrl.setRoot(DataListPage);
        this.navCtrl.popToRoot()
      },1)
  }


}
