import { Inject,Injectable } from '@angular/core';

import { DOCUMENT } from '@angular/common';

import { VariabiliService } from './variabili.service';
import { PreferencesService } from './preferences.service';
import { GraficiService } from './grafici.service';

@Injectable({
  providedIn: 'root'
})
export class ColorModeService {

  constructor(
    @Inject(DOCUMENT) private documentColorMode: Document,
    private preferencesService: PreferencesService,
    private variabiliService: VariabiliService,
    private graficiService: GraficiService
  ) { }

  async inizializeColorMode() {
    var colorMode = await this.preferencesService.get('colorMode')
    if (colorMode == null) {
      console.log("colorMode non esiste, la inizializzo")
      this.preferencesService.set("colorMode", 'auto')
      colorMode = 'auto'
    } else {
      console.log("colorMode esiste", colorMode)
    }
    this.variabiliService.colorMode = colorMode
    this.setColorMode(colorMode)

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDark.addEventListener('change', (e) => 
    {
      if (this.variabiliService.colorMode == 'auto') {
        if (prefersDark.matches) {
          this.graficiService.setColors('dark')
        } else {
          this.graficiService.setColors('light')
        }
      }
    });
  }

  setColorMode(colorMode: string) {
    this.documentColorMode.body.classList.remove('auto');
    this.documentColorMode.body.classList.remove('dark');
    this.documentColorMode.body.classList.remove('light');
    this.documentColorMode.body.classList.add(colorMode);
    this.preferencesService.set("colorMode", colorMode)

    // console.log("prefersDark", prefersDark)
    if (colorMode == 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      if (prefersDark.matches) {
        this.graficiService.setColors('dark')
      } else {
        this.graficiService.setColors('light')
      }
    } else if (colorMode == 'dark') {
      this.graficiService.setColors('dark')
    } else {
      this.graficiService.setColors('light')
    }
  }
}
