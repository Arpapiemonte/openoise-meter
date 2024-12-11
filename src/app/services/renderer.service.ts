import { Injectable } from '@angular/core';

import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class RendererService {

  coloriLivelliJSON: any

  constructor() {
    this.coloriLivelliJSON = require('../../assets/coloriLivelli.json');
  }

  coloriLivelli() {
    console.log("rendererService coloriLivelli")

    var circleMarker = {
      radius: 12,
      fillColor: "#FFFFFF",
      color: "#FFFFFF",
      weight: 1,
      opacity: 1,
      fillOpacity: 1,
    };

    var this_copy = this
    return function (feature: any, latlng: any) {

      feature.properties.metadata["LAEQ_N"] = Number(feature.properties.metadata["LAEQ"].replace(" dBA", "").replace(",", "."))


      for (let range of this_copy.coloriLivelliJSON) {
        if (feature.properties.metadata.LAEQ_N >= range.min && feature.properties.metadata.LAEQ_N < range.max) {
          circleMarker.fillColor = range.color
          circleMarker.color = "#8b8c8b" //range.color
          return L.circleMarker(latlng, circleMarker)
        }
      }

    }
  }

}
