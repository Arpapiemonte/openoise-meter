import { Component } from '@angular/core';
import { NavController, NavParams , Platform } from 'ionic-angular';

import { AppPreferences } from '@ionic-native/app-preferences';

import { TranslateService } from '@ngx-translate/core';

import { InfoPage } from '../info';


@Component({
  templateUrl: 'contacts.html'
})
export class ContactsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private appPreferences: AppPreferences,
              public platform: Platform, public translateService: TranslateService) {

  }

  ionViewWillEnter() {
    // back button to InfoPage
    this.platform.registerBackButtonAction(() => {
        this.navCtrl.setRoot(InfoPage);
        this.navCtrl.popToRoot();
    },1)
  }

}
