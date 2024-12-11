import { Inject, Injectable } from '@angular/core';

import { VariabiliService } from './variabili.service';
import { PreferencesService } from './preferences.service';
import { GraficiService } from './grafici.service';

@Injectable({
  providedIn: 'root'
})
export class ColorModeService {

  constructor(
    private preferencesService: PreferencesService,
    private variabiliService: VariabiliService,
    private graficiService: GraficiService
  ) { }

  setColorInterface() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    this.preferencesService.get('colorMode')
      .then(res => {
        console.log("colorMode", res)
        if (res == null || res == "") {
          this.preferencesService.set('colorMode', 'auto');
          if (prefersDark.matches) {
            this.setColorMode('dark')
          } else {
            this.setColorMode('light')
          }
        } else {
          switch (res) {
            case 'auto':
              if (prefersDark.matches) {
                this.setColorMode('dark')
              } else {
                this.setColorMode('light')
              }
              break
            case 'light':
              this.setColorMode('light')
              break
            case 'dark':
              this.setColorMode('dark')
              break
          }
        }
      })
      .catch(error => {
        console.log("errore colorMode", error)
      })

    prefersDark.addEventListener('change', (e) => {
      console.log("prefersDark addEventListener", prefersDark)
      this.preferencesService.get('colorMode')
        .then(res => {
          if (res == "auto") {
            if (prefersDark.matches) {
              this.setColorMode('dark')
            } else {
              this.setColorMode('light')
            }
          }
        })
        .catch(error => {
          console.log("errore colorMode", error)
        })
    })

  }

  setColorMode(color: string) {
    console.log("setColorMode", color)
    if (color == "dark") {
      this.variabiliService.colorMode = 'dark'
      this.graficiService.setColors('dark')
      document.body.classList.toggle('dark', true);
    } else {
      this.variabiliService.colorMode = 'light'
      this.graficiService.setColors('light')
      document.body.classList.toggle('dark', false);
    }
  }

  setColorModeAuto(color: string) {

    switch (color) {
      case 'auto':
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        if (prefersDark.matches) {
          this.setColorMode('dark')
        } else {
          this.setColorMode('light')
        }
        break
      case 'light':
        this.setColorMode('light')
        break
      case 'dark':
        this.setColorMode('dark')
        break
    }
  }

}
