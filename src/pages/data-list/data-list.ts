import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AlertController } from 'ionic-angular';

import { AppPreferences } from '@ionic-native/app-preferences';

import { File } from '@ionic-native/file';
import { DataViewPage } from '../data-view/data-view';
import { Platform, ActionSheetController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TranslateService } from '@ngx-translate/core';

import { HomePage } from '../home/home';

@Component({
  templateUrl: 'data-list.html'
})
export class DataListPage {


  allChecked:boolean = false;
  value:boolean;
  list:any;
  storageSettings:any;
  actionSheet: any;

  translation:any;

  show_all: boolean = false;
  show_no_file: boolean = false;
  show_list: boolean = false;
  show_action: boolean = false;

  constructor(public navCtrl: NavController, private appPreferences: AppPreferences, public file: File,
              public platform: Platform, public actionsheetCtrl: ActionSheetController, private socialSharing: SocialSharing,
              public alertCtrl: AlertController, public translateService: TranslateService
              ) {

      var this_copy = this;

      this.translateService.stream('DATA').subscribe((res: any) => {
                this.translation = res;
              });

      this.appPreferences.fetch('storageSettings').then((res) => {

                // console.log('res è ',res);

                if (res == null || res == "") {
                  // console.log('qui nullo')
                  this.show_list = false;
                  this.show_no_file = true;
                } else {

                  // console.log('qui non nullo')
                  this_copy.storageSettings = res;
                  this.show_list = true;
                  this.show_no_file = false;
                  file.listDir(this_copy.storageSettings.dirPathRoot, this_copy.storageSettings.dirName)
                          .then(list => {this_copy.list = list;
                                         console.log(list);
                                         // console.log(list.sort());
                                         // console.log(list.reverse())

                                         list.sort(function(a, b) {
                                                            var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                                                            var nameB = b.name.toUpperCase(); // ignore upper and lowercase
                                                            if (nameA < nameB) {
                                                              return -1;
                                                            }
                                                            if (nameA > nameB) {
                                                              return 1;
                                                            }

                                                              // i nomi devono essere uguali
                                                              return 0;
                                                            });
                                         console.log(list);

                                         for (var item of list){
                                           // console.log(item.name)
                                           item['checked'] = false;
                                         }

                                         if (list.length == 0) {
                                           this.show_list = false;
                                           this.show_no_file = true;
                                         }
                                         // console.log(this.list)
                                       })
                }
              });

  } // end costructor

  openMenu(fileObject) {

    var id_item = fileObject.name + "_item"
    var item = document.getElementById(id_item)
    var backgroundColor = window.getComputedStyle(item,null).getPropertyValue("background-color");
    var textColor = window.getComputedStyle(item,null).getPropertyValue("color");
    item.style.background = textColor;
    item.style.color = backgroundColor;
    window.setTimeout(function(){
      item.style.background = backgroundColor;
      item.style.color = textColor;
    }, 200);


    var this_copy = this;

    this.show_action = true

    this.actionSheet = this.actionsheetCtrl.create({
      title: 'File: ' + fileObject.name,
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: this_copy.translation.OPENMENU.OPEN,
          icon: 'eye',//!this.platform.is('ios') ? 'eye' : null,
          handler: () => {
            console.log('Open clicked');
            this.navCtrl.push(DataViewPage, {
              fileToView: fileObject
            });
          }
        },
        {
          text: this_copy.translation.OPENMENU.SHARE,
          icon: 'share',//!this.platform.is('ios') ? 'share' : null,
          handler: () => {
            console.log('Share clicked');
            var options = {
              message: this_copy.translation.OPENMENU.SHARE_MESSAGE, // not supported on some apps (Facebook, Instagram)
              subject: this_copy.translation.OPENMENU.SHARE_SUBJECT, // fi. for email
              files: [this_copy.storageSettings.dirPath + fileObject.name], // an array of filenames either locally or remotely
              url: '',//'https://www.website.com/foo/#bar?a=b',
              chooserTitle: this_copy.translation.OPENMENU.SHARE_CHOOSER_TITLE // Android only, you can override the default share sheet title
            }

            var onSuccess = function(result) {
              console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
              console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
            }

            var onError = function(msg) {
              console.log("Sharing failed with message: " + msg);
            }

            this.socialSharing.shareWithOptions(options);



          }
        },
        {
          text: this_copy.translation.OPENMENU.DELETE,
          role: 'destructive',
          icon: 'trash',//!this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            console.log('Delete clicked');
            let confirm = this.alertCtrl.create({
              title: this_copy.translation.OPENMENU.DELETE_TITLE,
              message: this_copy.translation.OPENMENU.DELETE_MESSAGE + ': ' + fileObject.name + '?',
              buttons: [
                {
                  text: this_copy.translation.OPENMENU.CANCEL,
                  handler: () => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: this_copy.translation.OPENMENU.DELETE,
                  handler: () => {
                    console.log('Delete clicked');
                    this.file.removeFile(this_copy.storageSettings.dirPath, fileObject.name)
                                .then(_ => {console.log('File deleted: ' + fileObject.name);
                                            this.navCtrl.setRoot(this.navCtrl.getActive().component);
                                  })
                                .catch(_ => console.log('File not delete: ' + fileObject.name))
                  }
                }
              ]
            });
            confirm.present()
          }
        },
        {
          text: this_copy.translation.OPENMENU.CANCEL,
          role: 'cancel', // will always sort to be on the bottom
          icon: 'close',//!this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    window.setTimeout(function(){
        this_copy.actionSheet.present();
    }, 300);

  }

  pressEvent(fileObject) {
    console.log(fileObject)
    this.show_all = true;
    var id_item = fileObject.name + "_item"
    var item = document.getElementById(id_item)
    var backgroundColor = window.getComputedStyle(item,null).getPropertyValue("background-color");
    var textColor = window.getComputedStyle(item,null).getPropertyValue("color");
    item.style.background = textColor;
    item.style.color = backgroundColor;
    window.setTimeout(function(){
      item.style.background = backgroundColor;
      item.style.color = textColor;
    }, 100);


  }

  shareSelected(){
    var this_copy = this;
    var filesToShare = [];
    // var checkedValue:any;
    // var inputElements:any = document.getElementsByClassName('checkBox');
    // console.log(inputElements)
    // for (var i=0; i < inputElements.length; ++i) {
    //       console.log(inputElements[i])
    //       console.log('checked ' + inputElements[i].checked)
    //       console.log('value ' + inputElements[i].value)
    //       console.log('checkedValue ' + inputElements[i].checkedValue)
    //     }
    for (var item of this_copy.list) {
      if (item.checked == true) {

        filesToShare.push(this_copy.storageSettings.dirPath + item.name)

      }

    }

    console.log('Share clicked');
    var options = {
      message: this_copy.translation.MULTI_SHARE.MESSAGE, // not supported on some apps (Facebook, Instagram)
      subject: this_copy.translation.MULTI_SHARE.SUBJECT, // fi. for email
      files: filesToShare, // an array of filenames either locally or remotely
      url: '',//'https://www.website.com/foo/#bar?a=b',
      chooserTitle: this_copy.translation.MULTI_SHARE.CHOOSER_TITLE // Android only, you can override the default share sheet title
    }

    var onSuccess = function(result) {
      console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
      console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
    }

    var onError = function(msg) {
      console.log("Sharing failed with message: " + msg);
    }

    this.socialSharing.shareWithOptions(options);

  }


  deleteSelected() {

    var this_copy = this;

    console.log( this_copy.translation)

    let confirm = this.alertCtrl.create({
      title: this_copy.translation.MULTI_DELETE.TITLE,
      message: this_copy.translation.MULTI_DELETE.MESSAGE + '?',
      buttons: [
        {
          text: this_copy.translation.MULTI_DELETE.CANCEL,
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: this_copy.translation.MULTI_DELETE.DELETE,
          handler: () => {
            console.log('Delete clicked');
            for (var item of this_copy.list) {
              if (item.checked == true) {
                console.log(item.name)
                this_copy.file.removeFile(this_copy.storageSettings.dirPath, item.name)
                            .then(_ => {console.log('File deleted: ' + item.name)
                              })
                            .catch(_ => console.log('File not delete: ' + item.name))
              }
            }
            this_copy.navCtrl.setRoot(this.navCtrl.getActive().component);
            this_copy.show_list = false;
            this_copy.show_no_file = true;
          }
        }
      ]
    });
    confirm.present();
  }

  modificaMolti() {
    this.show_all = true
  }


  ionViewWillEnter() {
    // back button to HomePage
    this.platform.registerBackButtonAction(() => {
      if (this.show_all == false && this.show_action == false) {
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.popToRoot()
      } else {
        if (this.show_all == true) {
          this.show_all = false
        }
        if (this.show_action == true) {
          this.show_action = false
          this.actionSheet.dismiss()
        }

      }
    },1)
  }

  ionViewWillLeave() {

      this.actionSheet.dismiss()
      this.show_action = false
  }


}
