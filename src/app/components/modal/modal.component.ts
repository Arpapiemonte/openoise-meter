import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemGroup,
  IonItemDivider,
  IonLabel,
  IonList,
  IonRadio,
  IonRadioGroup,
  IonRange,
  IonTextarea,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

import { Platform } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';

import { VariabiliService } from 'src/app/services/variabili.service';
import { FilesystemService } from 'src/app/services/filesystem.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  imports: [
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCheckbox,
    IonContent,
    IonFooter,
    IonHeader,
    IonIcon,
    IonItem,
    IonItemGroup,
    IonItemDivider,
    IonLabel,
    IonList,
    IonRadio,
    IonRadioGroup,
    IonRange,
    IonTextarea,
    IonTitle,
    IonToolbar,
    CommonModule
  ]
})
export class ModalComponent implements OnInit {
  @Input() modalType: any;
  @Input() file: any;
  @Input() filters: any = []

  fileOpenArrayMetadata: any
  fileOpenArrayData: any = []

  metadataGroups: any = []

  nMetadataCompiled = 0
  nMetadataTotal = 8

  constructor(
    private platform: Platform,
    private modalCtrl: ModalController,
    public variabiliService: VariabiliService,
    private filesystemService: FilesystemService,
  ) {
    addIcons({
      arrowBackOutline,
    });
  }

  cancel() {

    this.setModalData()
    console.log("this.variabiliService.modalData", this.variabiliService.modalData)
    return this.modalCtrl.dismiss(this.variabiliService.modalData, this.modalType);
  }

  setModalData() {
    var data: any
    if (this.modalType == 'measure') {
      data = {
        "from": 'measure',
        "data": this.file
      }
    }
    if (this.modalType == 'metadata') {
      data = {
        "from": 'metadata',
        "data": this.file
      }
    }
    if (this.modalType == 'filters') {
      data = {
        "from": 'filters',
        "data": this.filters
      }
    }

    this.variabiliService.modalData = data
  }

  readFile(fileName: any) {
    this.filesystemService.readFile(fileName).then(res => {
      // console.log("readFile res", res)
      this.fileOpenArrayData = []
      this.fileOpenArrayMetadata = []
      var metadata = ''
      var data = ''
      if (String(res.data).indexOf("===\n") > 0) {
        metadata = String(res.data).split('===\n')[0]
        data = String(res.data).split('===\n')[1]
        this.fileOpenArrayMetadata = metadata.split("\n")
      } else {
        data = String(res.data)
      }
      var dataLines = data.split("\n")
      for (let line of dataLines) {
        if (line.length > 0) {
          var lineSplit = line.split(this.variabiliService.saveOptions.field)
          if (lineSplit.length > 1) {
            this.fileOpenArrayData.push(lineSplit)
          }
        }
      }
      // console.log("this.fileOpenArrayData", this.fileOpenArrayData)
    })
  }

  ionChangeFilters(ev: any) {
    console.log("ionChangeFilters", ev.detail)

    if (ev.detail.checked) {
      this.filters.push(ev.detail.value)
    } else {
      const index = this.filters.indexOf(ev.detail.value);
      this.filters.splice(index, 1);
    }
    console.log("this.filters", this.filters)
  }

  textareaIonInputEventDetail(ev: any) {
    console.log('textareaIonInputEventDetail Current value:', ev);
    console.log('textareaIonInputEventDetail Current value:', JSON.stringify(ev.target.value));
    this.file.metadata.DESCRIPTION = ev.target.value
    this.countMetadataCompiled()
  }

  handleChangeRadioGroup(ev: any) {
    console.log("handleChangeRadioGroup", ev.detail)

    var metadata = this.variabiliService.metadataFromValueToLabel(ev.detail.value)
    this.file.metadata[metadata.metadataProperty] = metadata.label
    this.countMetadataCompiled()
  }

  feelingInput(ev: any) {
    console.log('feelingInput Current value:', JSON.stringify(ev.detail.value));
    if (this.modalType == "metadata") {
      this.file.metadata.FEELING = this.variabiliService.metadataFromValueToLabel(ev.detail.value).label
    }
    this.countMetadataCompiled()
  }

  appropriateInput(ev: any) {
    console.log('appropriateInput Current value:', JSON.stringify(ev.detail.value));
    if (this.modalType == "metadata") {
      this.file.metadata.APPROPRIATE = this.variabiliService.metadataFromValueToLabel(ev.detail.value).label
    }
    this.countMetadataCompiled()
  }

  setModal() {

    if (this.modalType == "measure") {
      console.log("file", this.file)
      this.readFile(this.file.name)
    }
    if (this.modalType == "CloudMeasure") {

    }
    if (this.modalType == "metadata" || this.modalType == "filters") {
      this.metadataGroups = [
        {
          groupName: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.HEADER_MEASURETYPE,
          groupRadioMetadataValue: ((this.file) ? this.variabiliService.metadataFromLabelToValue(this.file.metadata.TYPE).value : false),
          dividers: [{
            dividersName: false,
            dividersElements: [
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.OUTDOOR,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.OUTDOOR).value,
                checked: false
              },
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.INDOOR_OPEN_WINDOWS,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.INDOOR_OPEN_WINDOWS).value,
                checked: false
              },
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.INDOOR_CLOSE_WINDOWS,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.INDOOR_CLOSE_WINDOWS).value,
                checked: false
              },
            ]
          }]
        },
        {
          groupName: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.HEADER_ENVIRONMENT,
          groupRadioMetadataValue: ((this.file) ? this.variabiliService.metadataFromLabelToValue(this.file.metadata.ENVIRONMENT).value : false),
          dividers: [{
            dividersName: false,
            dividersElements: [
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.ENVIRONMENT_URBAN,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.ENVIRONMENT_URBAN).value,
                checked: false
              },
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.ENVIRONMENT_RURAL,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.ENVIRONMENT_RURAL).value,
                checked: false
              },
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.ENVIRONMENT_WILDERNESS,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.ENVIRONMENT_WILDERNESS).value,
                checked: false
              },
            ]
          }
          ],
        },
        {
          groupName: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.HEADER_SOURCETYPE,
          groupRadioMetadataValue: ((this.file) ? this.variabiliService.metadataFromLabelToValue(this.file.metadata.SOURCE).value : false),
          dividers: [{
            dividersName: false, //this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_GROUP_INFRASTRUCTURES,
            dividersElements: [
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_ROAD,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_ROAD).value,
                checked: false
              },
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_RAILWAY,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_RAILWAY).value,
                checked: false
              },
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_AIRPLANE,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_AIRPLANE).value,
                checked: false
              },
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_BOAT,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_BOAT).value,
                checked: false
              },
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_ELECTRO_MECHANICAL,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_ELECTRO_MECHANICAL).value,
                checked: false,
                subtitle: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_ELECTRO_MECHANICAL_SUB,
              },
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_VOICE,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_VOICE).value,
                checked: false,
                subtitle: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_VOICE_SUB
              },
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_MUSIC,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_MUSIC).value,
                checked: false,
                // subtitle: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_MUSIC_SUB
              },
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_NATURE,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_NATURE).value,
                checked: false,
                subtitle: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_NATURE_SUB,
              },
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_OTHER,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.SOURCETYPE_OTHER).value,
                checked: false,
                subtitle: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.METADATA_EDIT
              },
            ]
          },
          ],
        },
        {
          groupName: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.HEADER_WEATHER,
          groupRadioMetadataValue: ((this.file) ? this.variabiliService.metadataFromLabelToValue(this.file.metadata.WEATHER).value : false),
          dividers: [{
            dividersName: false,
            dividersElements: [
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_DRY,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_DRY).value,
                checked: false
              },
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_WET,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_WET).value,
                checked: false
              },
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_CLOUDY,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_CLOUDY).value,
                checked: false
              },
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_RAINY,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_RAINY).value,
                checked: false
              },
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_WINDY,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_WINDY).value,
                checked: false
              },
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_SNOW,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_SNOW).value,
                checked: false
              },
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_OTHER,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WEATHER_OTHER).value,
                checked: false,
                subtitle: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.METADATA_EDIT
              },
            ]
          }],
        },
        {
          groupName: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.HEADER_WHYTAKENOISE,
          groupRadioMetadataValue: ((this.file) ? this.variabiliService.metadataFromLabelToValue(this.file.metadata.WHYTAKENOISE).value : false),
          dividers: [{
            dividersName: false,
            dividersElements: [
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_TEST,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_TEST).value,
                checked: false
              },
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_ANNOYED,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_ANNOYED).value,
                checked: false
              },
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_PROFESSIONAL,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_PROFESSIONAL).value,
                checked: false
              },
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_STUDY,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_STUDY).value,
                checked: false
              },
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_EDUCATIONAL,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_EDUCATIONAL).value,
                checked: false
              },
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_ENTERTAIMENT,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_ENTERTAIMENT).value,
                checked: false
              },
              {
                name: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_OTHER,
                value: this.variabiliService.metadataFromLabelToValue(this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.WHYTAKENOISE_OTHER).value,
                checked: false,
                subtitle: this.variabiliService.translation.SAVE_FILES.EDIT_DESCRIPTION.METADATA_EDIT
              },
            ]
          }],
        },
      ]

      console.log("this.metadataGroups", this.metadataGroups)

      for (let group of this.metadataGroups) {
        for (let divider of group.dividers) {
          for (let dividersElement of divider.dividersElements) {
            if (this.filters.includes(dividersElement.value)) {
              dividersElement.checked = true
            }
          }
        }
      }

      this.countMetadataCompiled()
    }
  }

  countMetadataCompiled() {
    this.nMetadataCompiled = 0
    if (this.file.metadata.DESCRIPTION.length > 0) {
      this.nMetadataCompiled++
    }
    if (this.file.metadata.TYPE.length > 0) {
      this.nMetadataCompiled++
    }
    if (this.file.metadata.ENVIRONMENT.length > 0) {
      this.nMetadataCompiled++
    }
    if (this.file.metadata.SOURCE.length > 0) {
      this.nMetadataCompiled++
    }
    if (this.file.metadata.WEATHER.length > 0) {
      this.nMetadataCompiled++
    }
    if (this.file.metadata.WHYTAKENOISE.length > 0) {
      this.nMetadataCompiled++
    }
    if (Number(this.variabiliService.metadataFromLabelToValue(this.file.metadata.APPROPRIATE).value) > -1) {
      this.nMetadataCompiled++
    }
    if (Number(this.variabiliService.metadataFromLabelToValue(this.file.metadata.FEELING).value) > -1) {
      this.nMetadataCompiled++
    }
  }

  ngOnInit() {
    console.log("modalType", this.modalType)
    console.log("file", this.file)

    this.setModal()

    var androidBackButton = this.platform.backButton.subscribe(() => {
      console.log("androidBackButton ngOnInit modal")
      this.setModalData()
      androidBackButton.unsubscribe()
    })
  }




}
