import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TranslateService } from '@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization';
import { AppPreferences } from '@ionic-native/app-preferences';

// pages
import { HomePage } from '../pages/home/home';
import { CalibrationPage } from '../pages/calibration/calibration';
import { SettingsPage } from '../pages/settings/settings';
import { DataListPage } from '../pages/data-list/data-list';
import { preHomePage } from '../pages/pre-home/pre-home';
import { InfoPage } from '../pages/info/info';

import { ColorService } from '../pages/settings/colorService';

@Component({
  templateUrl: 'app.html',

  providers: [ColorService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  theme:any;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              public translateService: TranslateService, public globalization: Globalization, public appPreferences: AppPreferences,
              private colorService: ColorService) {

    // console.log('app compontent constructor')

    this.colorService.getTheme().subscribe(val => this.theme = val);

    var translation:any;
    this.translateService.stream('MENU').subscribe((res: any) => {
                // console.log('sono proprio qui nel menu')
                translation = res

                // console.log("res translation",res)

                if (this.platform.is('android')) {
                  this.pages = [
                    { title: translation.HOME, component: HomePage },
                    { title: translation.SETTINGS, component: SettingsPage },
                    { title: translation.DATA, component: DataListPage },
                    { title: translation.INFO, component: InfoPage },
                    { title: translation.EXIT, component: "exit" }
                  ];
                }
                if (this.platform.is('ios')) {
                  this.pages = [
                    { title: translation.HOME, component: HomePage },
                    { title: translation.SETTINGS, component: SettingsPage },
                    { title: translation.DATA, component: DataListPage },
                    { title: translation.INFO, component: InfoPage }
                  ];
                }

            });

    this.initializeApp();

    // used for an example of ngFor and navigation


  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // my customization
      this.inizializeAppCustom()
    });
  }

  openPage(page,i) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario

    if (page.component == "exit") {
      this.platform.exitApp();
    } else {
      this.nav.setRoot(page.component);
      console.log('Page:',page.title)
    }

    var id = i + "_id"
    var item = document.getElementById(id)
    var backgroundColor = window.getComputedStyle(item,null).getPropertyValue("background-color");
    var textColor = window.getComputedStyle(item,null).getPropertyValue("color");
    item.style.background = textColor;
    item.style.color = backgroundColor;
    window.setTimeout(function(){
      item.style.background = backgroundColor;
      item.style.color = textColor;
    }, 200);

  }

  inizializeAppCustom() {
    // console.log('app componente initializeAppCustom')

    // language and calibration
    this.appPreferences.fetch('firstRun')
              .then(res => {
                            if (res == null || res == "") {
                              // console.log('first running')
                              this.appPreferences.store("firstRun", 'no');
                              this.initializeLanguage();
                              this.appPreferences.store("color", "light");
                              this.theme = "light"
                              this.appPreferences.store("calibration", "0");
                            } else {
                              // console.log('not first running');
                              this.appPreferences.fetch('color').then((res) => {this.theme = res;
                                                                                // console.log("theme", res)

                                                                              });
                              this.translateService.setDefaultLang('en');
                              this.appPreferences.fetch('language').then((res) => {
                                                                                    this.translateService.use(res);
                                                                                    this.inizializeHome()
                                                                                  });


                            }
                          }
                    );

  }

  initializeLanguage() {
    // console.log('initializeLanguage')
    this.globalization.getPreferredLanguage()
           .then(res => {
                         this.translateService.setDefaultLang('en');
                         var lang = res.value.substr(0,2);
                         // console.log('getPreferredLanguage',lang)
                         if (lang == "it") {
                           this.translateService.use(lang);
                           this.appPreferences.store("language", lang);
                         } else {
                           this.translateService.use("en");
                           this.appPreferences.store("language", 'en');
                         }
                         // console.log('initializeLanguage then',lang)
                         this.inizializeHome()
                        }
                 )
           .catch(e => {
                         this.translateService.setDefaultLang('en');
                         this.appPreferences.store("language", 'en');
                       }
                 );
  }

  inizializeHome() {
    // home or pre-home
    this.appPreferences.fetch('pre-home')
              .then(res => {
                            // console.log("inizializeHome")
                            if (res == null || res == "" || res == 'false') {
                              this.rootPage = preHomePage;
                            } else {
                              this.rootPage = HomePage;
                            }
                          }
                    );
  }

  public setTheme(data) {
    this.theme = data
  }

}
