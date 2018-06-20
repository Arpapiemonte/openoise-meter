import { Component } from '@angular/core';
import { NavController, NavParams , Platform } from 'ionic-angular';

import { AppPreferences } from '@ionic-native/app-preferences';

import { TranslateService } from '@ngx-translate/core';

import { HomePage } from '../home/home';
import { WarningPage } from './warning/warning';
import { TutorialPage } from './tutorial/tutorial';
import { GlossaryPage } from './glossary/glossary';
import { PrivacyPage } from './privacy/privacy';
import { VersionPage } from './version/version';
import { ArpaPage } from './arpa/arpa';
import { ContactsPage } from './contacts/contacts';

@Component({
  templateUrl: 'info.html'
})
export class InfoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private appPreferences: AppPreferences,
              public platform: Platform, public translateService: TranslateService) {

  }

  doWarning() {
    this.navCtrl.push(WarningPage)
  }

  doTutorial() {
    this.navCtrl.push(TutorialPage)
  }

  doGlossary() {
    this.navCtrl.push(GlossaryPage)
  }

  doPrivacy() {
    this.navCtrl.push(PrivacyPage)
  }

  doVersion() {
    this.navCtrl.push(VersionPage)
  }

  doArpa() {
    this.navCtrl.push(ArpaPage)
  }

  doContacts() {
    this.navCtrl.push(ContactsPage)
  }

  ionViewWillEnter() {
    // back button to HomePage
    this.platform.registerBackButtonAction(() => {
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.popToRoot();
    },1)
  }
}
