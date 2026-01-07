import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { 
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent, 
  IonFooter,
  IonHeader, 
  IonIcon,
  IonItem,
  IonItemGroup,
  IonItemDivider,
  IonLabel,
  IonList,
  IonModal,
  IonRow,
  IonTitle, 
  IonToggle,
  IonToolbar 
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, 
  buildOutline, 
  gitMergeOutline, 
  logoGithub, 
  mailOutline, 
  peopleOutline, 
  ribbonOutline, 
  warningOutline 
} from 'ionicons/icons';

import { ToastController } from '@ionic/angular/standalone';

import { App } from '@capacitor/app';
import { Clipboard } from '@capacitor/clipboard';

import { VariabiliService } from 'src/app/services/variabili.service';
import { PreferencesService } from 'src/app/services/preferences.service';
//import { TranslateService } from '@ngx-translate/core';

import { PdfViewerModule } from 'ng2-pdf-viewer';


@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCol,
    IonContent, 
    IonFooter,
    IonHeader, 
    IonIcon,
    IonItem,
    IonItemGroup,
    IonItemDivider,
    IonLabel,
    IonList,
    IonModal,
    IonRow,
    IonTitle, 
    IonToggle,
    IonToolbar,
    CommonModule, 
    FormsModule,
    PdfViewerModule
  ]
})
export class InfoPage implements OnInit {
  versionNumber = ''
  isModalOpen = false;
  modalArgument = ''

  cards: any = []

  pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";

  urlPDF: any

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    //private translateService:TranslateService,
    private toastController: ToastController,
    public variabiliService: VariabiliService,
    public preferencesService: PreferencesService,
  ){
    addIcons({
      arrowBackOutline,
      buildOutline,
      gitMergeOutline,
      logoGithub,
      mailOutline,
      peopleOutline,
      ribbonOutline,
      warningOutline,
    });
   }

   async getAppVersion() {
    try {
      const info = await App.getInfo();
      console.log("plugin App", info);
      this.versionNumber = info.version
    }
    catch (err) {
      console.log("getAppVersion err", err)
    }
  }

  apriModal(input: string) {
    console.log("apriModal", input)
    this.modalArgument = input

    // console.log("this.modalArgument", this.modalArgument)
    // console.log("this.variabiliService.translation", this.variabiliService.translation)
    // console.log(this.variabiliService.translation["INFO"][input])
    if (this.modalArgument != "CREDITS") {
      for (let c of this.variabiliService.translation["INFO"][input]) {
        let card: any = {}
        for (let property in c) {
          // console.log("property", property)
          if (property.includes("TITLE")) {
            card["TITLE"] = c[property]
          }
          if (property.includes("TEXT")) {
            card["TEXT"] = c[property]
          }
        }
        this.cards.push(card)
      }
      console.log("this.cards", this.cards)
    }

    this.setOpen(true)

  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  chiudiModal() {
    this.setOpen(false)
  }

  onWillModalDismiss(event: any) {
    console.log("onWillModalDismiss")
    this.isModalOpen = false;
    this.cards = []
  }

  caricaPdf(event: any) {
    console.log("ionModalDidPresent caricaPdf")
    if (this.modalArgument === "PRIVACY") {
      if (this.variabiliService.language == 'it') {
        this.urlPDF = 'https://webgis.arpa.piemonte.it/openoise/openoise_privacy_it.pdf'
        // this.urlPDF = 'https://webgis.arpa.piemonte.it/openoise/informativa.pdf'
      } else {
        this.urlPDF = 'https://webgis.arpa.piemonte.it/openoise/openoise_privacy_en.pdf'
      }
    }
    console.log("this.urlPDF", this.urlPDF)
  }

  toggleChangePrivacy(event: any) {
    console.log('toggleChangePrivacy', event.detail.checked);

    this.variabiliService.privacyAccepted = event.detail.checked;
    this.preferencesService.set(
      'privacyAccepted',
      this.variabiliService.privacyAccepted
    );
  }

  apriUrl(url: any) {
    window.open(url, '_blank');
  }

  async copiaMail() {
    const writeToClipboard = await Clipboard.write({
      string: "openoise@arpa.piemonte.it"
    })

    this.presentToast(this.variabiliService.translation.INFO.CONTACTS[0].CONTACTS_TOAST)
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'middle',
      cssClass: 'toastClass'
    });

    await toast.present();
  }

  ngOnInit() {
    this.getAppVersion()
    var this_copy = this
    this.activatedRoute.queryParams.subscribe((res: any) => {
      console.log("activatedRoute res", res.value);
      if (res.value === "PRIVACY") {
        this_copy.apriModal(res.value)
      }
      this_copy.router.navigate([], {
        queryParams: {
          value: null,
        },
        queryParamsHandling: 'merge'
      })
    });
  }

}
