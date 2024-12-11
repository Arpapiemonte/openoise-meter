import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastController } from '@ionic/angular';

import { App } from '@capacitor/app';
import { Clipboard } from '@capacitor/clipboard';

import { VariabiliService } from 'src/app/services/variabili.service';
import { PreferencesService } from 'src/app/services/preferences.service';
//import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-info',
  templateUrl: 'info.page.html',
  styleUrls: ['info.page.scss']
})
export class InfoPage {

  versionNumber = ''
  isModalOpen = false;
  modalArgument = ''

  cards = []

  pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";

  urlPDF: any

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    //private translateService:TranslateService,
    private toastController: ToastController,
    public variabiliService: VariabiliService,
    public preferencesService: PreferencesService,
  ) { }

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
        let card = {}
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
        this.urlPDF = ''
        // this.urlPDF = ''
      } else {
        this.urlPDF = ''
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
