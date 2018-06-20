import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import { AppPreferences } from '@ionic-native/app-preferences';

import { SettingsPage } from '../settings/settings';


@Component({
  selector: 'page-range',
  templateUrl: 'range.html',
})
export class RangePage {

    range: any = {};


    constructor(public navCtrl: NavController, public platform: Platform, navParams: NavParams,
                private appPreferences: AppPreferences
              ) {

                this.range["lower"] = navParams.get('yMin')
                this.range["upper"] = navParams.get('yMax')

              }

    ionViewWillEnter() {
        // console.log('range ionViewWillEnter')
        // back button to SettingsPage
        this.platform.registerBackButtonAction(() => {
            this.navCtrl.setRoot(SettingsPage);
            this.navCtrl.popToRoot()
          },1)
      }

    ionViewWillLeave() {
        this.appPreferences.store("range_min", this.range.lower);
        this.appPreferences.store("range_max", this.range.upper);
      }

}
