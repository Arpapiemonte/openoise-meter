import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-legenda',
  templateUrl: './legenda.component.html',
  styleUrls: ['./legenda.component.scss'],
})
export class LegendaComponent implements OnInit {

  coloriLivelliJSON: any

  constructor() {
    this.coloriLivelliJSON = require('../../../assets/coloriLivelli.json');
    var style = "fill:FILL;fill-opacity:1;stroke:STROKE;stroke-width:6;stroke-dasharray:none;stroke-opacity:1"
    for (let range of this.coloriLivelliJSON) {
      range["svgStyle"] = style.replace("FILL", range.color).replace("STROKE", "#8b8c8b")
      if (range.min == 0) {
        range["label"] = "<= 35 dBA"
      } else if (range.min == 80) {
        range["label"] = "> 80 dBA"
      } else {
        range["label"] = range.min + ' - ' + range.max + ' dBA'
      }
    }
  }

  ngOnInit() { }

}
