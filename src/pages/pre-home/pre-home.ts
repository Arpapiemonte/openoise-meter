import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import { AppPreferences } from '@ionic-native/app-preferences';

import { HomePage } from '../home/home';


@Component({
  templateUrl: 'pre-home.html'
})
export class preHomePage {

  nomore:boolean = false;
  style:any = "simple";
  showStyle:any;

  constructor(public navCtrl: NavController, navParams: NavParams, private appPreferences: AppPreferences,
              public platform: Platform
              ) {

                // console.log("pre-home constructor")
                this.appPreferences.fetch('style').then((res) => {

                  if (res =='simple' || res == 'advanced') {
                    this.showStyle = false;
                    this.style = res
                  } else {
                    this.showStyle = true;
                  }

                });


  }

  goHome() {
    if (this.nomore == true) {
      this.appPreferences.store("pre-home", 'true');
    } else {
      this.appPreferences.store("pre-home", 'false');
    }

    this.appPreferences.store("style", this.style);

    this.navCtrl.setRoot(HomePage)
  }

}
