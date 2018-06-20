import { Component } from '@angular/core';
import { NavController, NavParams , Platform } from 'ionic-angular';

import { AlertController } from 'ionic-angular';

import { AppPreferences } from '@ionic-native/app-preferences';

import {TranslateService} from '@ngx-translate/core';

import { HomePage } from '../home/home';
import { CalibrationPage } from '../calibration/calibration';
import { RangePage } from '../range/range';

import { MyApp } from '../../app/app.component';

import { ColorService } from './colorService';

@Component({
  templateUrl: 'settings.html'
})
export class SettingsPage {

  styleValue:any;
  styleValuePreference:any;
  colorValue:any;
  colorValuePreference:any;
  languageValue:any;
  languageValuePreference:any;
  calibrationValue:any;
  calibrationValuePreference:any;
  rangeMinValue:any;
  rangeMaxValue:any;


  savingValue:any;
  savingValuePreference:any;
  savingShow:boolean = false;

  translation:any;

  settingInChange = false;
  settingInChangeAlert:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController, private appPreferences: AppPreferences,
              public platform: Platform, public translateService: TranslateService,
              private colorService: ColorService) {


  }

  doStyle() {
    //
    // var item1 = document.getElementById("doStyle1")
    // var item2 = document.getElementById("doStyle2")
    // var item3 = document.getElementById("doStyle3")
    // var backgroundColor = window.getComputedStyle(item1,null).getPropertyValue("background-color");
    // var textColor = window.getComputedStyle(item1,null).getPropertyValue("color");
    // item1.style.background = textColor;
    // item1.style.color = backgroundColor;
    // item2.style.background = textColor;
    // item2.style.color = backgroundColor;
    // item3.style.background = textColor;
    // item3.style.color = backgroundColor;
    // window.setTimeout(function(){
    //   item1.style.background = backgroundColor;
    //   item1.style.color = textColor;
    //   item2.style.background = backgroundColor;
    //   item2.style.color = textColor;
    //   item3.style.background = backgroundColor;
    //   item3.style.color = textColor;
    // }, 200);

    var this_copy = this;

    var simple:boolean = false;
    var advanced:boolean = false;

    if (this_copy.styleValuePreference == 'simple') {
      simple = true
    }
    if (this_copy.styleValuePreference == 'advanced') {
      advanced = true
    }


    let alert = this.alertCtrl.create({
      title: this_copy.translation.STYLE.TITLE,
      subTitle: '',
      enableBackdropDismiss: false,
      cssClass: 'alertCustom'
    });
    this.settingInChangeAlert = alert;


    alert.addInput({
      type: 'radio',
      label: this_copy.translation.STYLE.SIMPLE,
      value: 'simple',
      checked: simple
    });

    alert.addInput({
      type: 'radio',
      label: this_copy.translation.STYLE.ADVANCED,
      value: 'advanced',
      checked: advanced
    });

    alert.addButton({
      text: this_copy.translation.CANCEL,
      handler: () => {
        this.settingInChange = false;
      }
    });

    alert.addButton({
      text: 'Ok',
      handler: data => {
        this.appPreferences.store("style", data);
        this.styleValuePreference = data
        this.settingInChange = false;

        this.updateValues()

      }
    });

    alert.present().then(() => {
      this.settingInChange = true;
    });

  }

  doColor() {
    var this_copy = this;

    var light:boolean = false;
    var dark:boolean = false;
    var black:boolean = false;

    if (this_copy.colorValuePreference == 'light') {
      light = true
    }
    if (this_copy.colorValuePreference == 'dark') {
      dark = true
    }
    if (this_copy.colorValuePreference == 'black') {
      black = true
    }


    let alert = this.alertCtrl.create({
      title: this_copy.translation.COLOR.TITLE,
      subTitle: '',
      enableBackdropDismiss: false,
      cssClass: 'alertCustom'
    });
    this.settingInChangeAlert = alert;


    alert.addInput({
      type: 'radio',
      label: this_copy.translation.COLOR.LIGHT,
      value: 'light',
      checked: light
    });

    alert.addInput({
      type: 'radio',
      label: this_copy.translation.COLOR.DARK,
      value: 'dark',
      checked: dark
    });

    alert.addInput({
      type: 'radio',
      label: this_copy.translation.COLOR.BLACK,
      value: 'black',
      checked: black
    });

    alert.addButton({
      text: this_copy.translation.CANCEL,
      handler: () => {
        this.settingInChange = false;
      }
    });

    alert.addButton({
      text: 'Ok',
      handler: data => {
        this.appPreferences.store("color", data);
        this.colorValuePreference = data
        this.settingInChange = false;

        this.colorService.setTheme(data);

        this.updateValues()

      }
    });

    alert.present().then(() => {
      this.settingInChange = true;
    });

  }

  doLanguage() {
    var this_copy = this;

    var english:boolean = false;
    var italiano:boolean = false;

    if (this_copy.languageValuePreference == 'en') {
      english = true
    }
    if (this_copy.languageValuePreference == 'it') {
      italiano = true
    }


    let alert = this.alertCtrl.create({
      title: this_copy.translation.LANGUAGE.TITLE,
      subTitle: '',
      enableBackdropDismiss: false
    });
    this.settingInChangeAlert = alert;


    alert.addInput({
      type: 'radio',
      label: 'English',
      value: 'en',
      checked: english
    });

    alert.addInput({
      type: 'radio',
      label: 'Italiano',
      value: 'it',
      checked: italiano
    });

    alert.addButton({
      text: this_copy.translation.CANCEL,
      handler: () => {
        this.settingInChange = false;
      }
    });

    alert.addButton({
      text: this_copy.translation.OK,
      handler: data => {
        this.appPreferences.store("language", data);
        this.translateService.use(data)
        this.languageValuePreference = data
        this.settingInChange = false;

        this.updateValues()

      }
    });

    alert.present().then(() => {
      this.settingInChange = true;
    });

  }



  doCalibraton() {
    this.navCtrl.push(CalibrationPage)
  }

  doRange() {

      this.navCtrl.push(RangePage,{
        yMin: this.rangeMinValue,
        yMax: this.rangeMaxValue
      })

  }


  doSaving() {
    var this_copy = this;

    var saving_true:boolean = true;
    var saving_false:boolean = false;

    if (this_copy.savingValuePreference == 'true') {
      saving_true = true
      saving_false = false
    }
    if (this_copy.savingValuePreference == 'false') {
      saving_true = false
      saving_false = true
    }


    let alert = this.alertCtrl.create({
      title: this_copy.translation.SAVING.TITLE,
      subTitle: '',
      enableBackdropDismiss: false
    });
    this.settingInChangeAlert = alert;


    alert.addInput({
      type: 'radio',
      label: this_copy.translation.SAVING.YES,
      value: 'true',
      checked: saving_true
    });

    alert.addInput({
      type: 'radio',
      label: this_copy.translation.SAVING.NO,
      value: 'false',
      checked: saving_false
    });

    alert.addButton({
      text: this_copy.translation.CANCEL,
      handler: () => {
        this.settingInChange = false;
      }
    });

    alert.addButton({
      text: 'Ok',
      handler: data => {
        // console.log('saving scelto', data)
        this.appPreferences.store("saving", data);
        this.savingValuePreference = data
        this.settingInChange = false;

        this.updateValues()

        this.navCtrl.setRoot(this.navCtrl.getActive().component)

      }
    });

    alert.present().then(() => {
      this.settingInChange = true;
    });

  }



  updateValues() {
    // Necessary for the translation

    // it's also possible this only line but cause the page refresh
    // this.navCtrl.setRoot(this.navCtrl.getActive().component)

    // style
    if (this.styleValuePreference == 'simple') {
      this.styleValue = this.translation.STYLE.SIMPLE
      this.savingShow = false
    }
    if (this.styleValuePreference == 'advanced') {
      this.styleValue = this.translation.STYLE.ADVANCED
      this.savingShow = true
    }

    // color
    if (this.colorValuePreference == 'light') {
      this.colorValue = this.translation.COLOR.LIGHT
    }
    if (this.colorValuePreference == 'dark') {
      this.colorValue = this.translation.COLOR.DARK
    }
    if (this.colorValuePreference == 'black') {
      this.colorValue = this.translation.COLOR.BLACK
    }

    // language
    if (this.languageValuePreference == 'en') {
      this.languageValue = "English"
    }
    if (this.languageValuePreference == 'it') {
      this.languageValue = "Italiano"
    }

    // saving
    if (this.savingValuePreference == 'true') {
      this.savingValue = this.translation.SAVING.YES
    }
    if (this.savingValuePreference == 'false') {
      this.savingValue = this.translation.SAVING.NO
    }

  }


  loadPreferences() {
    var this_copy = this;

    // get translation
    this.translateService.stream('SETTINGS').subscribe((res: any) => {
                this_copy.translation = res
            });

    // get style preference
    this.appPreferences.fetch('style').then((res) => {

      this_copy.styleValuePreference = res;

      if (this_copy.styleValuePreference == 'simple') {
        this_copy.styleValue = this_copy.translation.STYLE.SIMPLE
        this.savingShow = false
      }
      if (this_copy.styleValuePreference == 'advanced') {
        this_copy.styleValue = this_copy.translation.STYLE.ADVANCED
        this.savingShow = true
      }

    });


    // get color preference
    this.appPreferences.fetch('color').then((res) => {

      this_copy.colorValuePreference = res;

      if (this_copy.colorValuePreference == 'light') {
        this_copy.colorValue = this_copy.translation.COLOR.LIGHT
      }
      if (this_copy.colorValuePreference == 'dark') {
        this_copy.colorValue = this_copy.translation.COLOR.DARK
      }
      if (this.colorValuePreference == 'black') {
        this.colorValue = this.translation.COLOR.BLACK
      }

    });

    // get language preference
    this.appPreferences.fetch('language').then((res) => {

      this_copy.languageValuePreference = res

      if (res == 'en') {
          this_copy.languageValue = "English"
      }
      if (res == 'it') {
          this_copy.languageValue = "Italiano"
      }

      });

      // get calibration preference
      this.appPreferences.fetch('calibration').then((res) => {
          // console.log('calibration', res)
          if (isNaN(res) || res == null || res == "") {
              this.appPreferences.store("calibration", "0");
              this.calibrationValuePreference = 0;
              this.calibrationValue = 0;
          } else {
              this.calibrationValuePreference = res;
              if (res >= 0) {
                this.calibrationValue = '+' + res + ' dBA';
              } else {
                this.calibrationValue = res + ' dBA';
              }
          }
          });

      // get range preference
      this.appPreferences.fetch('range_min').then((res) => {

          if (isNaN(res) || res == null || res == "") {
              this.appPreferences.store("range_min", "0");
              this.rangeMinValue = "0" ;
          } else {
              this.rangeMinValue = res;
          }
          });

      this.appPreferences.fetch('range_max').then((res) => {
          // console.log('range', res)
          if (isNaN(res) || res == null || res == "") {
          this.appPreferences.store("range_max", "110");
          this.rangeMaxValue = "110" ;
      } else {
          this.rangeMaxValue = res;
      }
          });

      // get saving preference
      this.appPreferences.fetch('saving').then((res) => {
          // console.log('saving preference', res)
          if (res == null || res == "") {
              this.appPreferences.store("saving", "false");
              this.savingValuePreference = "false";
              this.savingValue = this_copy.translation.SAVING.NO;
          } else {
              this.savingValuePreference = res;
              if (res == 'true') {
                this_copy.savingValue = this_copy.translation.SAVING.YES
              }
              if (res == 'false') {
                this_copy.savingValue = this_copy.translation.SAVING.NO
              }
          }
        });

  }


  // 1
  // ionViewDidLoad() {
  //      console.log('settings ionViewDidLoad')
  // }

  // 2
  ionViewWillEnter() {
       // console.log('settings ionViewWillEnter')
       this.loadPreferences()

       // back button to HomePage
       this.platform.registerBackButtonAction(() => {
         if (this.settingInChange == false) {
           this.navCtrl.setRoot(HomePage);
           this.navCtrl.popToRoot()
           // this.settingInChangeAlert.dismiss()
         } else {
           this.settingInChangeAlert.dismiss()
           this.settingInChange = false;
         }
       },1)
    }
  //
  // // 3
  // ionViewDidEnter() {
  //        console.log('settings ionViewDidEnter')
  //     }
  //
  //
  // // 4
  // ionViewCanLeave() {
  //     console.log('settings ionViewCanLeave')
  // }
  //
  // // 5
  // ionViewWillLeave() {
  //      console.log('settings ionViewWillLeave')
  //   }
  //
  // // 6
  // ionViewDidLeave() {
  //      console.log('settings ionViewDidLeave')
  //   }
  //
  // // 7
  // ionViewWillUnload() {
  //      console.log('settings ionViewWillUnload')
  // }

}
