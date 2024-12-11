import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { VariabiliService } from './variabili.service';

@Injectable({
  providedIn: 'root'
})
export class MappaService {
  public mappaBaseS: Subject<string> = new Subject();

  constructor(
    public variabiliService: VariabiliService,
  ) {
  }

  mappeBaseLeaflet: any
  mappeBaseLeafletIOS = [
    {
      "type": "tileLayer",
      "name": "OpenStreetMap",
      "label": "OpenStreetMap",
      "tileLayerURL": "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      "attribution": '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      "thumb": "assets/images/base/openstreetmap.png",
      "opacity": 1
    },
    {
      "type": "tileLayer",
      "name": "Ortofoto arcgisonline",
      "label": this.variabiliService.translation.MAP.ORTO, //"Ortofoto",
      "tileLayerURL": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      // "attribution": "",
      "thumb": "assets/images/base/10df2279f9684e4a9f6a7f08febac2a9.png",
      "opacity": 1
    },
  ]
  mappeBaseLeafletOthers = [
    // { // mapserver deprecato!!!!
    //   "type": "tileLayer",
    //   "name": "",
    //   "label": "Topografica classica (tile layer deprecato)",
    //   "tileLayerURL": "https://server.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/MapServer/tile/{z}/{y}/{x}",
    //   // "attribution": "",
    //   "thumb": "assets/images/base/World_Topo_Map.png",
    //   "opacity": 1
    // },
    // {
    //   "type": "vectorTile",
    //   "name": "World Topographic Map",
    //   "label": "Topografica classica vector",
    //   "webmapId": "7dc6cea0b1764a1f9af2e679f642f0f5",
    //   "tiledMapLayerURL": "https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer",
    //   "vectorTileLayerIds": ["7dc6cea0b1764a1f9af2e679f642f0f5"],
    //   "vectorTileServer": "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer",
    //   "thumb": "assets/images/base/World_Topo_Map.png",
    //   "opacity1": 0.6,
    //   "opacity2": 0.95
    // },
    {
      "type": "basemapEsri",
      "name": "Topografica",
      "label": this.variabiliService.translation.MAP.TOPO, //"Topografica",
      "basemapEsri": "ArcGIS:Topographic",
      "thumb": "assets/images/base/World_Topo_Map.png",
    },
    // {
    //   "type": "basemapEsri",
    //   "name": "Topografica in scala di grigi",
    //   "label": "Topografica in scala di grigi",
    //   "basemapEsri": "ArcGIS:Terrain",
    //   "thumb": "assets/images/base/World_Topo_Map.png",
    // },
    // {
    //   "type": "basemapEsri",
    //   "name": "ArcGIS:LightGray",
    //   "label": "ArcGIS:LightGray",
    //   "basemapEsri": "ArcGIS:LightGray",
    //   "thumb": "assets/images/base/World_Topo_Map.png",
    // },
    // {
    //   "type": "basemapEsri",
    //   "name": "ArcGIS:Navigation",
    //   "label": "ArcGIS:Navigation",
    //   "basemapEsri": "ArcGIS:Navigation",
    //   "thumb": "assets/images/base/World_Topo_Map.png",
    // },
    {
      "type": "basemapEsri",
      "name": "OpenStreetMap_dal_2022-03-14",
      "label": "OpenStreetMap",
      "basemapEsri": "OSM:Standard",
      "thumb": "assets/images/base/openstreetmap.png",
    },
    // {
    //   "type": "basemapEsri",
    //   "name": "OpenStreetMap Rilievi",
    //   "label": "OpenStreetMap Rilievi",
    //   "basemapEsri": "OSM:StandardRelief",
    //   "thumb": "assets/images/base/World_Topo_Map.png",
    // },
    {
      "type": "basemapEsri",
      "name": "Ortofoto",
      "label": this.variabiliService.translation.MAP.ORTO, //"Ortofoto",
      "basemapEsri": "ArcGIS:Imagery",
      "thumb": "assets/images/base/10df2279f9684e4a9f6a7f08febac2a9.png",
    },
    // PROVE MAP PROXY ARPA
    // { // Map proxy arcgis_imagery_layer
    //   "type": "tileLayer",
    //   "name": "osm_3857",
    //   "label": "osm_3857",
    //   "tileLayerURL": "",
    //   // "attribution": "",
    //   "thumb": "assets/images/base/openstreetmap.png",
    //   "opacity": 1
    // },
    // { // arcgis_imagery_TOPO_layer_3857
    //   "type": "tileLayer",
    //   "name": "arcgis_imagery_TOPO_layer_3857",
    //   "label": "arcgis_imagery_TOPO_layer_3857",
    //   "tileLayerURL": "",
    //   // "attribution": "",
    //   "thumb": "assets/images/base/World_Topo_Map.png",
    //   "opacity": 1
    // },
    // { // arcgis_imagery_layer_3857
    //   "type": "tileLayer",
    //   "name": "arcgis_imagery_layer_3857",
    //   "label": "arcgis_imagery_layer_3857",
    //   "tileLayerURL": "",
    //   // "attribution": "",
    //   "thumb": "assets/images/base/10df2279f9684e4a9f6a7f08febac2a9.png",
    //   "opacity": 1
    // },
  ]

  mappeBaseLeafletProxyArpa = [
    { // Map proxy arpa arcgis_imagery_TOPO_layer_3857
      "type": "tileLayer",
      "name": "proxyArpa_arcgis_imagery_TOPO_layer_3857",
      "label": this.variabiliService.translation.MAP.TOPO, //"Topografica",
      "tileLayerURL": "",
      "attribution": "",
      "thumb": "assets/images/base/World_Topo_Map.png",
      "opacity": 1
    },
    { // Map proxy arpa osm_3857
      "type": "tileLayer",
      "name": "proxyArpa_osm_3857",
      "label": "OpenStreetMap",
      "tileLayerURL": "",
      "attribution": "",
      "thumb": "assets/images/base/openstreetmap.png",
      "opacity": 1
    },
    { // Map proxy arpa arcgis_imagery_layer_3857
      "type": "tileLayer",
      "name": "proxyArpa_arcgis_imagery_layer_3857",
      "label": this.variabiliService.translation.MAP.ORTO, //"Ortofoto",
      "tileLayerURL": "",
      "attribution": "",
      "thumb": "assets/images/base/10df2279f9684e4a9f6a7f08febac2a9.png",
      "opacity": 1
    },
  ]
  mappaBaseAttuale: any

  setMappaBaseS(mappaBase: any) {
    // console.log("setMappaBaseS",mappa)
    this.mappaBaseS.next(mappaBase)
    this.mappaBaseAttuale = mappaBase
  }

  getMappaBaseS() {
    // console.log("getMappaBaseBS",this.getMappaBaseBS.asObservable())
    return this.mappaBaseS.asObservable();
  }
}
