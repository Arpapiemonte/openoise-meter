import { Component } from '@angular/core';

import { VariabiliService } from 'src/app/services/variabili.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    public variabiliService:VariabiliService
  ) {}

}
