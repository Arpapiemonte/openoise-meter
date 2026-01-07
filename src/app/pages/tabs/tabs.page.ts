import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { folderOutline, earthOutline, settingsOutline, informationOutline } from 'ionicons/icons';

import { VariabiliService } from 'src/app/services/variabili.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor(
    public variabiliService:VariabiliService
  ) {
    addIcons({ 
      earthOutline,
      folderOutline,
      informationOutline,
      settingsOutline,
     });
  }
}
