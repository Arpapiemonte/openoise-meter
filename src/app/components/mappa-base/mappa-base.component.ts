import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { MappaService } from 'src/app/services/mappa.service';

@Component({
  selector: 'app-mappa-base',
  templateUrl: './mappa-base.component.html',
  styleUrls: ['./mappa-base.component.scss'],
})
export class MappaBaseComponent implements OnInit {
  @Output() chiudiDaComponent = new EventEmitter<any>();

  constructor(
    public mappaService: MappaService,
  ) { }

  cambiaBase(mappaBase: any) {
    console.log("cambiaBase", mappaBase)
    this.mappaService.mappaBaseAttuale = mappaBase
    this.mappaService.setMappaBaseS(mappaBase)

    this.chiudiDaComponent.emit(true)
  }

  ngOnInit() {
    console.log("PASS")
  }

}
