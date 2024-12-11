import { Component, Input, OnInit } from '@angular/core';

import { AlertController } from '@ionic/angular'
import { ModalController } from '@ionic/angular';

import { VariabiliService } from 'src/app/services/variabili.service';
import { FilesystemService } from 'src/app/services/filesystem.service';
import { MappaService } from 'src/app/services/mappa.service';
import { RendererService } from 'src/app/services/renderer.service';
import { ModalComponent } from 'src/app/components/modal/modal.component';

import * as L from 'leaflet';
import 'leaflet.markercluster';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  map: any
  mapDiv: boolean = false
  mappaBaseArray: any = []
  mapCenter: any
  mapZoom: any
  zoomExtentZoomOut: boolean = false
  viewBoundsPiemonte = L.latLngBounds(L.latLng(46.4641, 9.2142), L.latLng(44.0601, 6.6266))

  localFeatures: any
  cloudFeatures: any
  measureOwner = 'own'
  cloudMeasuresBoolean: boolean = false
  layerMeasures: any
  layerMeasuresCluster: any

  subscriptionMappaBase: any

  isInlineModalOpen = false;
  modalArgomento: any

  filters: any = []
  filtersLabel = ""
  filtersGroups: any = {
    "TYPE": [],
    "ENVIRONMENT": [],
    "SOURCE": [],
    "WEATHER": [],
    "WHYTAKENOISE": []
  }
  filteredMeasures = 0

  constructor(
    private alertController: AlertController,
    private modalController: ModalController,
    public variabiliService: VariabiliService,
    private filesystemService: FilesystemService,
    private mappaService: MappaService,
    private rendererService: RendererService,
  ) {
    this.subscriptionMappaBase = this.mappaService.getMappaBaseS().subscribe((val: any) => {
      console.log('getMappaBaseBS mappaComponent', val)
      if (this.map) {
        // this.mappaBase.removeFrom(this.map)
        // this.mappaBase = L.tileLayer(val.url, {
        //   attribution: val.attribution,
        //   opacity: val.opacity
        // }).addTo(this.map);
        this.gestisciMappaBase('remove')
        this.gestisciMappaBase('add')
      }
    })
  }

  async creaMappa() {
    var this_copy = this

    this.map = L.map('mapid', {
      // center: this.viewCenter,
      // zoom: this.viewZoom,
      zoomSnap: 0.2,
      zoomDelta: 0.5
    })

    L.control.scale().addTo(this.map);

    // fit Piemonte
    // this.map.fitBounds(L.latLngBounds(L.latLng(46.4641, 9.2142), L.latLng(44.0601, 6.6266)))

    this.gestisciMappaBase('add')

    await this.addMeasures()

    if (!this.mapCenter) {
      if (this.variabiliService.lastPosition) {
        if (isNaN(this.variabiliService.lastPosition.lat) === false) {
          var center = L.latLng(this.variabiliService.lastPosition.lat, this.variabiliService.lastPosition.lon)
          this.map.setView(center, 16)
        }
      }
      this.getPosition(false)
    } else {
      console.log("center to old center", this.mapCenter, this.mapZoom)
      this_copy.map.setView(this.mapCenter, this.mapZoom)
    }

    // EVENTS
    this.map.on('moveend', function (ev) {
      console.log("map moveend")
      console.log("this_copy.map.getCenter()", this_copy.map.getCenter())
      console.log("this_copy.map.getZoom()", this_copy.map.getZoom())
      this_copy.mapCenter = this_copy.map.getCenter()
      this_copy.mapZoom = this_copy.map.getZoom()
    })

    // BOTTONI
    function newButton(position: string, url: string, funzione) {
      return L.Control.extend({
        options: {
          position: position
        },
        onAdd: function (map) {
          var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
          var a = L.DomUtil.create('div', 'leafletButtonCustom', container);
          a.style.backgroundImage = "url(" + url + ")";
          container.onclick = funzione
          return container;
        }
      });
    }

    var buttonExpand = newButton('topleft', './assets/images/mappa/expand.svg', function () {
      this_copy.zoomExtent()
    })
    this.map.addControl(new buttonExpand);

    // var buttonMappaBase = newButton('topright', './assets/images/mappa/layers-outline.svg', function () {
    //   this_copy.openInlineModal({ 'argomento': "mappa-base" })
    // })
    // this.map.addControl(new buttonMappaBase);

    var buttonLocate = newButton('topleft', './assets/images/mappa/pin.svg', function () {
      this_copy.getPosition(true)
    })
    this.map.addControl(new buttonLocate);

    var buttonLegend = newButton('topright', './assets/images/mappa/list.svg', function () {
      this_copy.openInlineModal({ 'argomento': "legenda" })
    })
    this.map.addControl(new buttonLegend);
  }

  gestisciMappaBase(operation: string) {
    console.log("this.mappaService.mappaBaseAttuale", this.mappaService.mappaBaseAttuale)

    if (operation == "add") {
      if (this.mappaService.mappaBaseAttuale.type == "tileLayer") {
        this.mappaBaseArray.push(
          L.tileLayer(this.mappaService.mappaBaseAttuale.tileLayerURL, {
            // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            attribution: this.mappaService.mappaBaseAttuale.attribution,
            opacity: this.mappaService.mappaBaseAttuale.opacity
          })
        )
      }
      // COMMENTATA LA PARTE CON ESRI
      // if (this.mappaService.mappaBaseAttuale.type == "basemapEsri") {
      //   var apikey = ""
      //   this.mappaBaseArray.push(
      //     LesriVector.vectorBasemapLayer(this.mappaService.mappaBaseAttuale.basemapEsri, {
      //       // provide either apikey or token
      //       apikey: apikey
      //     })
      //   )
      // }
      // if (this.mappaService.mappaBaseAttuale.type == "vectorTile") {
      //   this.mappaBaseArray.push(
      //     Lesri.tiledMapLayer({
      //       url: this.mappaService.mappaBaseAttuale.tiledMapLayerURL,
      //       opacity: this.mappaService.mappaBaseAttuale.opacity1
      //     })
      //   )
      //   for (let id of this.mappaService.mappaBaseAttuale.vectorTileLayerIds) {
      //     this.mappaBaseArray.push(
      //       LesriVector.vectorTileLayer(id, {
      //         portalUrl: "https://www.arcgis.com",
      //         opacity: this.mappaService.mappaBaseAttuale.opacity2
      //       })
      //     )
      //   }
      //   // this.mappaBaseArray.push(
      //   //   LesriVector.vectorTileLayer(
      //   //     this.mappaService.mappaBaseAttuale.vectorTileServer
      //   //   )
      //   // )
      // }

      for (let m of this.mappaBaseArray) {
        m.addTo(this.map)
      }
    }
    if (operation == "remove") {
      for (let m of this.mappaBaseArray) {
        m.removeFrom(this.map)
      }
      this.mappaBaseArray = []
    }

    console.log("mappaBaseArray", this.mappaBaseArray)
  }

  addLocalMeasuresClick(measureOwner: string) {
    this.measureOwner = measureOwner
    if (this.measureOwner == 'own') {
      this.cloudMeasuresBoolean = false
    } else {
      this.cloudMeasuresBoolean = true
    }
    this.addMeasures()
  }

  async addMeasures() {
    console.log("addMeasures")

    var this_copy = this
    this.filteredMeasures = 0

    if (this.layerMeasures) {
      this.layerMeasures.removeFrom(this.map)
      this.layerMeasuresCluster.removeFrom(this.map)
    }

    var features: any

    if (this.measureOwner == 'own') {
      if (!this.localFeatures) {
        console.log("reading localFeatures")
        var files: any = await this.filesystemService.recuperaFiles()
        this.localFeatures = this.createMeasuresFeatures(files)
      }
      features = this.localFeatures
    } else {
      if (!this.cloudFeatures) {
        console.log("reading cloudFeatures")
        const url = ""
        let response = await fetch(url, { cache: "no-cache" });
        let cloudMeasures = await response.json();
        console.log("cloudMeasures", cloudMeasures)
        this.cloudFeatures = this.createMeasuresFeatures(cloudMeasures)
      }
      features = this.cloudFeatures
    }

    if (features.length > 0) {
      var measuresGEOJSON = {
        "type": "FeatureCollection",
        "name": "Misure locali",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": features
      }

      this.layerMeasures = L.geoJSON(measuresGEOJSON, {
        pointToLayer: this.rendererService.coloriLivelli(),
        onEachFeature: onEachFeature,
        // filter: (this.filters.length > 0 ? measuresFilters : true)
        filter: measuresFilters
      })
      // this.layerMeasures.addTo(this.map)
      // this.layerMeasures.on('click', function (click) {
      //   console.log("layerMeasures click.layer", click.layer)
      //   console.log("layerMeasures click.layer.feature", click.layer.feature)
      // })

      // cluster misure
      this.layerMeasuresCluster = L.markerClusterGroup(
        {
          spiderfyDistanceMultiplier: 3,
        }
      );
      this.layerMeasuresCluster.addLayer(this.layerMeasures);
      // this.layerMeasuresCluster.addLayer(L.marker(L.getRandomLatLng(this.map)))
      this.map.addLayer(this.layerMeasuresCluster)
      var this_copy = this
      // this.layerMeasuresCluster.on('click', function (a) {
      //   console.log('marker ', a.layer);
      // });
      // this.layerMeasuresCluster.on('clusterclick', function (a) {
      //   // a.layer is actually a cluster
      //   console.log('cluster ', a.layer.getAllChildMarkers().length);
      //   console.log('cluster ', a.layer.getAllChildMarkers());
      // });

      // this.map.on('click', function (click) {
      //   console.log("map click", click)
      // })

      console.log("measuresGEOJSON", measuresGEOJSON)
      // console.log("this.layerMeasures", this.layerMeasures)
    } else {
      console.log("nessuna misura presente")
      this.presentAlert(this.variabiliService.translation.MAP.ALERT_HEAD, "", this.variabiliService.translation.MAP.ALERT_TEXT1)
      this.getPosition(true)
    }

    function onEachFeature(feature, layer) {

      var modalType = ""
      if (this_copy.cloudMeasuresBoolean) {
        modalType = "cloudMeasure"
      } else {
        modalType = "measure"
      }

      var div1 = document.createElement('div')
      div1.innerHTML = feature.properties.metadata.popupContent
      var div2 = document.createElement('div')
      div2.style.textAlign = "center"
      var button = document.createElement('ion-button')
      button.setAttribute("mode", "ios")
      button.setAttribute("color", "secondary")
      button.innerHTML = this_copy.variabiliService.translation.MAP.MEASURE_DETAILS;
      button.addEventListener("click", function () { this_copy.openExternalModal({ modalType: modalType, file: feature.properties }) })
      div2.appendChild(button)
      div1.appendChild(div2)

      // does this feature have a property named popupContent?
      if (feature.properties && feature.properties.metadata.popupContent) {
        // layer.bindPopup(feature.properties.popupContent)
        layer.bindPopup(div1)
      }
    }

    function measuresFilters(feature: any) {
      var output = false
      var outputType = false
      var outputEnvironment = false
      var outputSource = false
      var outputWeather = false
      var outputWhy = false

      if (this_copy.filters.length > 0) {
        if (this_copy.filtersGroups["TYPE"].length > 0) {
          if (this_copy.filtersGroups["TYPE"].includes(feature.properties.metadata.TYPE)) {
            outputType = true
          }
        } else {
          outputType = true
        }
        if (this_copy.filtersGroups["ENVIRONMENT"].length > 0) {
          if (this_copy.filtersGroups["ENVIRONMENT"].includes(feature.properties.metadata.ENVIRONMENT)) {
            outputEnvironment = true
          }
        } else {
          outputEnvironment = true
        }
        if (this_copy.filtersGroups["SOURCE"].length > 0) {
          if (this_copy.filtersGroups["SOURCE"].includes(feature.properties.metadata.SOURCE)) {
            outputSource = true
          }
        } else {
          outputSource = true
        }
        if (this_copy.filtersGroups["WEATHER"].length > 0) {
          if (this_copy.filtersGroups["WEATHER"].includes(feature.properties.metadata.WEATHER)) {
            outputWeather = true
          }
        } else {
          outputWeather = true
        }
        if (this_copy.filtersGroups["WHYTAKENOISE"].length > 0) {
          if (this_copy.filtersGroups["WHYTAKENOISE"].includes(feature.properties.metadata.WHYTAKENOISE)) {
            outputWhy = true
          }
        } else {
          outputWhy = true
        }

        if (outputType && outputEnvironment && outputSource && outputWeather && outputWhy) {
          output = true
        }

      } else {
        output = true
      }

      if (output) this_copy.filteredMeasures++

      return output

    }

  }

  createMeasuresFeatures(measures: any) {
    var features = []
    for (let m of measures) {
      if ("metadata" in m) {
        if ("DESCRIPTION" in m.metadata) {
          if (isNaN(m.metadata.COORDINATES[0]) === false) {
            var labelName = ""
            if (m.name == "Community measure") {
              labelName = this.variabiliService.translation.MAP.COMMUNITY_MEASURE
            } else {
              labelName = "File: " + m.name
              m.metadata.TYPE = this.variabiliService.metadataFromLabelToValue(m.metadata.TYPE).value
              m.metadata.ENVIRONMENT = this.variabiliService.metadataFromLabelToValue(m.metadata.ENVIRONMENT).value
              m.metadata.SOURCE = this.variabiliService.metadataFromLabelToValue(m.metadata.SOURCE).value
              m.metadata.WEATHER = this.variabiliService.metadataFromLabelToValue(m.metadata.WEATHER).value
              m.metadata.WHYTAKENOISE = this.variabiliService.metadataFromLabelToValue(m.metadata.WHYTAKENOISE).value
            }

            m.metadata["popupContent"] = "<h4>LAeq: " + m.metadata.LAEQ + "</h4>" +
              "<div><b>" + this.variabiliService.translation.SAVE_FILES.METADATA.DESCRIPTION + ":</b> " + m.metadata.DESCRIPTION + "</div>" +
              "<div><b>" + this.variabiliService.translation.SAVE_FILES.METADATA.SOURCE + ":</b> " + this.variabiliService.metadataFromValueToLabel(m.metadata.SOURCE).label + "</div>" +
              "<div><b>" + this.variabiliService.translation.SAVE_FILES.METADATA.MEASURE_START + ":</b> " + m.metadata.MEASURE_START + "</div>" +
              "<div><b>" + this.variabiliService.translation.SAVE_FILES.METADATA.MEASURE_DURATION + ":</b> " + m.metadata.MEASURE_DURATION + "</div>" +
              "<div style='padding:8px 0px;'><i>" + labelName + "</i></div>"
            features.push({
              "type": "Feature",
              "properties": m,
              "geometry": { "type": "Point", "coordinates": [m.metadata.COORDINATES[1], m.metadata.COORDINATES[0]] }
            })
          }
        }
      }
    }
    return features
  }


  async openExternalModal(modalProps: any) {
    console.log("openExternalModal")
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: modalProps
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (this.variabiliService.modalData.from === 'filters') {
      this.filters = this.variabiliService.modalData.data
      this.setFiltersGroups()
      console.log("this.filterGroups", this.filtersGroups)
      this.addMeasures()
      if (this.filters.length > 0) {
        this.filtersLabel = ""
        for (let filter of this.filters) {
          this.filtersLabel = this.filtersLabel + " " + this.variabiliService.metadataFromValueToLabel(filter).label + ","
        }
        this.filtersLabel = this.filtersLabel.slice(0, -1);
      } else {
        this.filtersLabel = ""
      }
    }
  }

  setFiltersGroups() {
    this.filtersGroups = {
      "TYPE": [],
      "ENVIRONMENT": [],
      "SOURCE": [],
      "WEATHER": [],
      "WHYTAKENOISE": []
    }
    for (let f of this.filters) {
      if (this.variabiliService.metadataFromValueToLabel(f).metadataProperty == "TYPE") {
        this.filtersGroups["TYPE"].push(f)
      }
      if (this.variabiliService.metadataFromValueToLabel(f).metadataProperty == "ENVIRONMENT") {
        this.filtersGroups["ENVIRONMENT"].push(f)
      }
      if (this.variabiliService.metadataFromValueToLabel(f).metadataProperty == "SOURCE") {
        this.filtersGroups["SOURCE"].push(f)
      }
      if (this.variabiliService.metadataFromValueToLabel(f).metadataProperty == "WEATHER") {
        this.filtersGroups["WEATHER"].push(f)
      }
      if (this.variabiliService.metadataFromValueToLabel(f).metadataProperty == "WHYTAKENOISE") {
        this.filtersGroups["WHYTAKENOISE"].push(f)
      }
    }
  }

  openInlineModal(input: any) {
    this.modalArgomento = input.argomento
    this.setOpenInlineModal(true)
  }

  closeInlineModal() {
    this.setOpenInlineModal(false)
  }
  setOpenInlineModal(isOpen: boolean) {
    this.isInlineModalOpen = isOpen;
  }

  onWillInlineModalDismiss(event: any) {
    console.log("onWillInlineModalDismiss")
    this.isInlineModalOpen = false;
  }

  chiudiDaComponent(value: any) {
    console.log("chiudiDaComponent", value)
    this.closeInlineModal()
  }


  async zoomExtent() {
    console.log("zoomExtent", "center to measures")
    var misureFitBounds = L.featureGroup([this.layerMeasures]).getBounds().pad(0.3)
    this.map.fitBounds(misureFitBounds)
  }

  async getPosition(boolean: boolean) {

    var cooordinatesLatLon: any
    var lat: any
    var lon: any

    cooordinatesLatLon = await this.variabiliService.getLocPosition()

    lat = cooordinatesLatLon.lat
    lon = cooordinatesLatLon.lon

    if (isNaN(lat) === false) {
      var center = L.latLng(lat, lon)
      var zoom = 16

      var previsioniIcon = L.Icon.extend({
        options: {
          iconSize: [40, 32],
        }
      });

      if (boolean) {
        var markerPosition = L.marker(center, { icon: new previsioniIcon({ iconUrl: "./assets/images/mappa/pin_red.svg" }) })
        markerPosition.addTo(this.map)
        var markerVisible = true

        var this_copy = this
        var i = 0
        var intervalPosition = setInterval(function () {
          if (markerVisible) {
            markerPosition.removeFrom(this_copy.map)
            markerVisible = false
          } else {
            markerPosition.addTo(this_copy.map)
            markerVisible = true
          }
          if (i == 6) clearInterval(intervalPosition)
          i++
        }, 1000)
      }

      this.map.setView(center, zoom)
      this.mapCenter = this.map.getCenter()
      this.mapZoom = this.map.getZoom()

    } else {
      this.map.setView(L.latLng(44.8, 8.35), 12)
      this.map.fitBounds(this.viewBoundsPiemonte)
      this.mapCenter = this.map.getCenter()
      this.mapZoom = this.map.getZoom()
    }

  }

  openFilter() {
    this.openExternalModal({ modalType: "filters", filters: this.filters })
  }

  resetFilter() {
    this.filters = []
    this.addMeasures()
  }

  async presentAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['OK'],
      cssClass: 'alertClass'
    });

    await alert.present();
  }

  async checkNetwork() {
    if (!(await this.variabiliService.checkNetwork())) {
      this.presentAlert(this.variabiliService.translation.MAP.ALERT_HEAD, "", this.variabiliService.translation.OTHER.NETWORK_MESSAGE.NO_NETWORK)
    }
  }

  async readCloudData() {
    const url = ""
    let response = await fetch(url, { cache: "no-cache" });
    let data = await response.json();
    console.log("cloud data", data)
  }

  ionViewWillEnter() {
    console.log("MapPage ionViewWillEnter")
    this.mapDiv = true
  }

  ionViewDidEnter() {
    console.log("MapPage ionViewDidEnter")
    this.creaMappa()
    this.checkNetwork()
  }

  ionViewWillLeave() {
    console.log("MapPage ionViewWillLeave")
    this.mapDiv = false
    this.localFeatures = false
    this.cloudFeatures = false
  }
  ionViewDidLeave() {
    console.log("MapPage ionViewDidLeave")

  }

  ngOnInit() {
    console.log("MapPage ngOnInit")
  }

  ngOnDestroy() {
    console.log("MapPage ngOnDestroy")
    this.subscriptionMappaBase.unsubscribe()
  }

}
