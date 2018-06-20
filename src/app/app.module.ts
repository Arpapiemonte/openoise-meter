import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { CalibrationPage } from '../pages/calibration/calibration';
import { RangePage } from '../pages/range/range';
import { DataListPage } from '../pages/data-list/data-list';
import { DataViewPage } from '../pages/data-view/data-view';
import { preHomePage } from '../pages/pre-home/pre-home';
import { InfoPage } from '../pages/info/info';
import { WarningPage } from '../pages/info/warning/warning';
import { TutorialPage } from '../pages/info/tutorial/tutorial';
import { GlossaryPage } from '../pages/info/glossary/glossary';
import { PrivacyPage } from '../pages/info/privacy/privacy';
import { VersionPage } from '../pages/info/version/version';
import { ArpaPage } from '../pages/info/arpa/arpa';
import { ContactsPage } from '../pages/info/contacts/contacts';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AppPreferences } from '@ionic-native/app-preferences';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

// translation
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
// get device language
import { Globalization } from '@ionic-native/globalization';



// providers written by me
// import {GlobalVars} from '../providers/globalVars';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CalibrationPage,
    SettingsPage,
    RangePage,
    DataListPage,
    DataViewPage,
    preHomePage,
    InfoPage,
    WarningPage,
    TutorialPage,
    GlossaryPage,
    PrivacyPage,
    VersionPage,
    ArpaPage,
    ContactsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CalibrationPage,
    SettingsPage,
    RangePage,
    DataListPage,
    DataViewPage,
    preHomePage,
    InfoPage,
    WarningPage,
    TutorialPage,
    GlossaryPage,
    PrivacyPage,
    VersionPage,
    ArpaPage,
    ContactsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AppPreferences,
    File,
    SocialSharing,
    // GlobalVars,
    ScreenOrientation,
    Globalization
  ]
})
export class AppModule {


}
