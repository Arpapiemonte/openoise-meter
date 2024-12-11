import { Injectable } from '@angular/core';

import { VariabiliService } from './variabili.service';
import { AudioCfgService } from './audio-cfg.service';

@Injectable({
  providedIn: 'root'
})
export class GraficiService {

  red: string = 'rgb(246,29,29)'
  purple: string = 'rgb(179,102,255)'
  blue: string = 'rgb(0,0,255)'
  green: string = 'rgb(70,168,103)'
  chartBackgroundColorDark: string = '#1a1a1a'
  chartTextColorDark: string = '#999999'
  chartGridColor1: string = '#595959'
  chartGridColor2: string = '#999999'
  chartGridColor3: string = '#b3b3b3'

  visualizzaGrafico = 'chartLAeqTimeRunning'

  octaveLabels: Array<string> = ["16", "31.5", "63", "125", "250", "500", "1k", "2k", "4k", "8k", "16k"];

  thirdOctaveLabels: Array<string> = ["16", "20", "25", "31.5", "40", "50", "63", "80", "100", "125", "160", "200", "250", "315", "400", "500",
    "630", "800", "1000", "1250", "1600", "2000", "2500", "3150", "4000", "5000", "6300", "8000", "10000", "12500", "16000", "20000"];
  thirdOctaveValues: Array<number> = [16, 20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500,
    630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000];

  fftLabels: Array<string> = ["20", "50", "100", "200", "500", "1K", "2K", "5K", "10K", "20K"];
  fftLabelsValues: Array<number> = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
  fftVerticalGridValues: Array<number> = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
    100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,
    1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 20000];

  colorscaleValue = [
    [0, "rgb(0, 0, 0)"], //  nero
    [0.1, "rgb(153, 255, 102)"], //  verde chiaro
    [0.2, "rgb(0, 204, 0)"], //  verde scuro
    [0.3, "rgb(255, 255, 26)"], //  giallo
    [0.4, "rgb(255, 204, 0)"], //  arancio
    [0.5, "rgb(255, 153, 0)"], //  arancio scuro
    [0.6, "rgb(255, 26, 26)"], //  rosso chiaro
    [0.7, "rgb(153, 0, 0)"], //  rosso scuro
    [0.8, "rgb(255, 51, 204)"], //  purple
    [0.9, "rgb(51, 51, 204)"], //  blu
    [1, "rgb(255, 255, 255)"], //  bianco
  ];
  colorscaleValueZero = [
    [0, "rgb(0, 0, 0)"], //  nero
    [0.1, "rgb(153, 255, 102)"], //  verde chiaro
    [0.2, "rgb(0, 204, 0)"], //  verde scuro
    [0.3, "rgb(255, 255, 26)"], //  giallo
    [0.4, "rgb(255, 204, 0)"], //  arancio
    [0.5, "rgb(255, 153, 0)"], //  arancio scuro
    [0.6, "rgb(255, 26, 26)"], //  rosso chiaro
    [0.7, "rgb(153, 0, 0)"], //  rosso scuro
    [0.8, "rgb(255, 51, 204)"], //  purple
    [0.9, "rgb(51, 51, 204)"], //  blu
    [1, "rgb(255, 255, 255)"], //  bianco
  ];

  margin = {
    l: 40,
    r: 50,
    b: 45,
    t: 30,
    pad: 0
  }

  chartLAeqTimeRunningData: any = {
    level: {
      x: [],
      y: [],
      name: 'LAeq(1s)',
      type: 'scatter',
      mode: 'lines',
      line: {
        shape: 'hv',
        color: this.red
      },
      visible: this.variabiliService.chartVisibiltyGlobalsLAeq1s
    },
    running: {
      x: [],
      y: [],
      name: 'LAeq(t)',
      type: 'scatter',
      mode: 'lines ',
      line: {
        shape: 'hv',
        color: this.purple
      },
      xaxis: 'x2',
      visible: this.variabiliService.chartVisibiltyGlobalsLAeqt
    },
    marker: {
      x: [],
      y: [],
      name: 'Marker',
      type: 'scatter',
      mode: 'lines',
      line: {
        shape: 'hv',
        color: 'rgba(255, 165, 0, 0.5)',
        width: 25,
      },
      // fill: 'toself',
      // fillcolor: 'rgba(255, 165, 0, 0.5)',
      xaxis: 'x2',
      visible: true
    }
  }

  public chartLAeqTimeRunning = {
    // data: [
    //   { x: [], y: [], type: 'scatter', name: 'LAeq(1s)' },
    //   { x: [], y: [], type: 'scatter', name: 'LAeq(t)' },
    // ],
    data: [],
    layout: {
      // autosize: true,
      width: window.innerWidth,
      height: 0.8 * window.innerWidth,
      margin: this.margin,
      plot_bgcolor: this.chartBackgroundColorDark,
      paper_bgcolor: this.chartBackgroundColorDark,
      font: {
        color: this.chartTextColorDark,
      },
      // title: 'A Fancy Plot',
      xaxis: {
        range: [-30, 0],
        ticks: 'outside',
        dtick: 1,
        ticklen: 2,
        showticklabels: false,
        side: 'bottom',
        zeroline: false,
        gridcolor: this.chartGridColor1,
      },
      xaxis2: {
        range: [-30, 0],
        // title: this.variabiliService.translation.CHARTS.AXIS_TIME,
        ticks: 'outside',
        dtick: 5,
        // ticksuffix: ' sec',
        // showticksuffix: 'last',
        overlaying: 'x',
        zeroline: false,
        showline: true,
        gridcolor: this.chartGridColor3,
      },
      yaxis: {
        // title: this.variabiliService.translation.CHARTS.AXIS_DBA,
        range: [this.variabiliService.range.lower, this.variabiliService.range.upper],
        ticks: 'outside',
        dtick: this.creaYaxisDtick(),
        // labelalias: {[this.variabiliService.range.upper]: 'dBA'},
        zeroline: false,
        showline: true,
        gridcolor: '',
      },
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0,
        xanchor: 'right',
        y: 1.03,
        yanchor: 'bottom',
        text: 'dBA',
        showarrow: false
      },
      {
        xref: 'paper',
        yref: 'paper',
        x: 1.01,
        xanchor: 'left',
        y: 0.0,
        yanchor: 'middle',
        text: 's',
        showarrow: false
      }],
      datarevision: 0,
      showlegend: false,
      legend: {
        orientation: "h",
        x: 0,
        xanchor: "left",
        y: -0.15,
        yanchor: "top",
        font: {
          color: ['red', 'blue']
        },
      },
      barmode: 'stack'
    },
    config: { staticPlot: true }
  };


  chartThirdOctavesData: any = {
    min: {
      x: [],
      y: [],
      type: 'bar',
      name: 'LZmin',
      marker: { color: this.green },
      xaxis: 'x2'
    },
    level: {
      x: [],
      y: [],
      type: 'bar',
      name: 'Leq(1s)',
      marker: { color: this.red }
    },
    running: {
      x: [],
      y: [],
      type: 'bar',
      name: 'Leq(t)',
      marker: { color: this.purple }
    },
    max: {
      x: [],
      y: [],
      type: 'bar',
      name: 'LZmax',
      marker: { color: this.blue }
    }
  }

  public chartThirdOctaves = {
    data: [],
    layout: {
      // autosize: true,
      width: window.innerWidth,
      height: 0.8 * window.innerWidth,
      margin: this.margin,
      plot_bgcolor: this.chartBackgroundColorDark,
      paper_bgcolor: this.chartBackgroundColorDark,
      font: {
        color: this.chartTextColorDark,
      },
      xaxis: {
        range: [-0.5,31.5],
        ticks: 'outside',
        dtick: 1,
        ticklen: 2,
        showticklabels: false,
        side: 'bottom',
        zeroline: false,
      },
      xaxis2: {
        // title: this.variabiliService.translation.CHARTS.AXIS_FREQUENCY_OCTAVES,
        range: [-0.5,31.5],
        overlaying: 'x',
        showline: true,
        ticks: 'outside',
        tickmode: "array",
        tickvals: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30],
        ticktext: this.octaveLabels,
        // tickangle: 90,
      },
      yaxis: {
        // title: this.variabiliService.translation.CHARTS.AXIS_DB,
        range: [this.variabiliService.range.lower, this.variabiliService.range.upper],
        ticks: 'outside',
        dtick: this.creaYaxisDtick(),
        // labelalias: {[this.variabiliService.range.upper]: 'dB'},
        zeroline: false,
        showline: true,
        gridcolor: '',
      },
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0,
        xanchor: 'right',
        y: 1.03,
        yanchor: 'bottom',
        text: 'dB',
        showarrow: false
      },
      {
        xref: 'paper',
        yref: 'paper',
        x: 1.01,
        xanchor: 'left',
        y: 0,
        yanchor: 'middle',
        text: 'Hz',
        showarrow: false
      }
      ],
      datarevision: 0,
      showlegend: false,
      legend: {
        orientation: "h",
        x: 0,
        xanchor: "left",
        y: -0.6,
        yanchor: "bottom",
        // entrywidth: 0.25,
        // entrywidthmode: 'fraction'
      },
      barmode: 'overlay'
    },
    config: { staticPlot: true }
  };


  chartSonogramData: any = {
    value: {
      x: [],
      y: [],
      z: [],
      type: 'heatmap',
      zmin: this.variabiliService.range.lower,
      zmax: this.variabiliService.range.upper,
      colorscale: this.colorscaleValue,
      showscale: true,
      colorbar: {
        x: -0,
        xanchor: 'left',
        y: -0.45,
        orientation: 'h',
        len: 1,
        showticksuffix: 'last',
        ticksuffix: '   dB'
        // title: 'dB', //set title
        // titleside: 'bottom', //set postion
      }
    },
    zeroValue: {
      x: [],
      y: [],
      z: [],
      type: 'heatmap',
      zmin: this.variabiliService.range.lower,
      zmax: this.variabiliService.range.upper,
      xaxis: 'x2',
      yaxis: 'y2',
      colorscale: this.colorscaleValue,
      showscale: false

    }
  }

  public chartSonogram = {
    data: [],
    layout: {
      // autosize: true,
      width: window.innerWidth,
      height: window.innerWidth,
      margin: this.margin,
      plot_bgcolor: this.chartBackgroundColorDark,
      paper_bgcolor: this.chartBackgroundColorDark,
      font: {
        color: this.chartTextColorDark,
      },
      xaxis: {
        ticks: 'outside',
        dtick: 1,
        ticklen: 2,
        showticklabels: false,
        side: 'bottom',
        zeroline: false,
        // gridcolor: 'whitesmoke',
      },
      xaxis2: {
        // title: this.variabiliService.translation.CHARTS.AXIS_TIME,
        ticks: 'outside',
        dtick: 5,
        // ticksuffix: ' sec',
        // showticksuffix: 'last',
        overlaying: 'x',
        zeroline: false,
        showline: true,
        // gridcolor: '#A9A9A9',
      },
      yaxis: {
        ticks: 'outside',
        dtick: 1,
        ticklen: 2,
        showticklabels: false,
        side: 'bottom',
        zeroline: false,
      },
      yaxis2: {
        // title: this.variabiliService.translation.CHARTS.AXIS_FREQUENCY_OCTAVES,
        overlaying: 'y',
        showline: true,
        ticks: 'outside',
        tickmode: "array",
        tickvals: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30],
        ticktext: this.octaveLabels,
        // labelalias: {'16k': 'Hz'},
        // showtickprefix: 'all',
        // tickprefix: 'Hz'
      },
      // yaxis: {
      //   title: 'Livello sonoro (dBA)',
      //   range: [this.variabiliService.range.lower, this.variabiliService.range.upper],
      //   ticks: 'outside',
      //   dtick: this.creaYaxisDtick(),
      //   zeroline: false,
      //   showline: true,
      // },
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0,
        xanchor: 'right',
        y: 1.03,
        yanchor: 'bottom',
        text: 'Hz',
        showarrow: false
      },
      {
        xref: 'paper',
        yref: 'paper',
        x: 1.01,
        xanchor: 'left',
        y: 0,
        yanchor: 'middle',
        text: 's',
        showarrow: false
      }
      ],
      datarevision: 0,
      showlegend: false,
      // legend: {
      //   "orientation": "h",
      //   "x": 1,
      //   "xanchor": "right",
      //   "y": 1.1,
      //   "yanchor": "bottom",
      // },
      // barmode: 'overlay'
      coloraxis: {
        colorbar: {
          orientation: 'h'
        }
      }
    },
    config: { staticPlot: true }
  };

  chartFFTData: any = {
    dbA: {
      x: [],
      y: [],
      name: 'LAeq(1s)',
      type: "scatter",
      line: {width: 1},
      marker: { color: this.green },
      xaxis: 'x2'
    },
    db: {
      x: [],
      y: [],
      name: 'Leq(1s)',
      line: {width: 1},
      type: "scatter",
      marker: { color: this.red },
    },
  }

  public chartFFT = {
    data: [
      { x: [], y: [], type: 'scatter', name: 'LAeq(1s)', line: {width: 0.5} },
      { x: [], y: [], type: 'scatter', name: 'LZeq(1s)', line: {width: 3} },
    ],
    layout: {
      // autosize: true,
      width: window.innerWidth,
      height: 0.8 * window.innerWidth,
      margin: this.margin,
      plot_bgcolor: this.chartBackgroundColorDark,
      paper_bgcolor: this.chartBackgroundColorDark,
      font: {
        color: this.chartTextColorDark,
      },
      xaxis: {
        range: [1, 4.397940009],
        ticks: 'outside',
        dtick: 1,
        ticklen: 2,
        tickmode: 'array',
        tick0: 3,
        tickvals: this.fftVerticalGridValues,
        ticktext: this.fftVerticalGridValues,
        showticklabels: false,
        side: 'bottom',
        zeroline: false,
        type: 'log',
        gridcolor: this.chartGridColor1,
      },
      xaxis2: {
        range: [1, 4.397940009],
        // title: this.variabiliService.translation.CHARTS.AXIS_FREQUENCY_FFT,
        overlaying: 'x',
        showline: true,
        ticks: 'outside',
        tickmode: 'array',
        tickvals: this.fftLabelsValues,
        ticktext: this.fftLabels,
        showticklabels: true,
        zeroline: false,
        type: 'log',
        visible: true,
        gridcolor: this.chartGridColor1,
      },
      yaxis: {
        // title: this.variabiliService.translation.CHARTS.AXIS_DB_DBA,
        range: [this.variabiliService.range.lower, this.variabiliService.range.upper],
        ticks: 'outside',
        dtick: this.creaYaxisDtick(),
        // labelalias: {[this.variabiliService.range.upper]: 'dB/dBA'},
        zeroline: true,
        showline: true,
        gridcolor: '',
      },
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: -0.1,
        xanchor: 'left',
        y: 1.03,
        yanchor: 'bottom',
        text: 'dB/dBA',
        showarrow: false
      },
      {
        xref: 'paper',
        yref: 'paper',
        x: 1.01,
        xanchor: 'left',
        y: 0,
        yanchor: 'middle',
        text: 'Hz',
        showarrow: false
      }
      ],
      datarevision: 0,
      showlegend: false,
      legend: {
        orientation: "h",
        x: 0,
        xanchor: "left",
        y: -0.6,
        yanchor: "bottom",
      },
      barmode: 'overlay'
    },
    config: { staticPlot: true }
  };

  constructor(
    public variabiliService: VariabiliService,
    public audioCfgService: AudioCfgService,
  ) {

    this.inizializzaGrafici()

  }

  inizializzaGrafici() {
    console.log("inizializzaData")

    var ticksTotal: number = this.variabiliService.numberSec * 1000 / this.variabiliService.time;
    var ticksDelta: number = this.variabiliService.numberSec / ticksTotal;

    // LAeq variables and x value for sonogramData
    for (let i = 0; i < ticksTotal + 1; i++) {
      var x_value = - this.variabiliService.numberSec + i * ticksDelta;

      this.chartLAeqTimeRunningData.level.x[i] = x_value
      this.chartLAeqTimeRunningData.running.x[i] = x_value
      this.chartLAeqTimeRunningData.marker.x[i] = x_value
      this.chartLAeqTimeRunningData.level.y[i] = 0
      this.chartLAeqTimeRunningData.running.y[i] = 0
      this.chartLAeqTimeRunningData.marker.y[i] = null

      // x value for sonogramData
      this.chartSonogramData.value.x[i] = x_value
      this.chartSonogramData.zeroValue.x[i] = x_value
    }

    // Third Octaves variables and y value for sonogramData
    var thirdOctavesNumber = 0
    for (let i = 0; i < this.thirdOctaveValues.length; i++) {
      this.chartThirdOctavesData.min.x[i] = thirdOctavesNumber
      this.chartThirdOctavesData.min.y[i] = 0
      this.chartThirdOctavesData.level.x[i] = thirdOctavesNumber
      this.chartThirdOctavesData.level.y[i] = 0
      this.chartThirdOctavesData.max.x[i] = thirdOctavesNumber
      this.chartThirdOctavesData.max.y[i] = 0
      this.chartThirdOctavesData.running.x[i] = thirdOctavesNumber
      this.chartThirdOctavesData.running.y[i] = 0

      // y value for sonogramData
      this.chartSonogramData.value.y[i] = thirdOctavesNumber
      this.chartSonogramData.zeroValue.y[i] = thirdOctavesNumber

      thirdOctavesNumber++
    }

    // z value for sonogramData
    for (let i = 0; i < this.thirdOctaveValues.length; i++) {
      var zElement = []
      for (let i = 0; i < ticksTotal + 1; i++) {
        zElement.push(0)
      }
      this.chartSonogramData.value.z[i] = zElement
      this.chartSonogramData.zeroValue.z[i] = zElement
    }

    for (let i = 0; i < this.audioCfgService.bufferFFT_all_platform / 2; i++) {
      this.chartFFTData.dbA.x[i] = i * this.audioCfgService.freqResolution + this.audioCfgService.freqResolution
      this.chartFFTData.db.x[i] = i * this.audioCfgService.freqResolution + this.audioCfgService.freqResolution
      this.chartFFTData.dbA.y[i] = 0
      this.chartFFTData.db.y[i] = 0
    }

    this.chartLAeqTimeRunning.data = [this.chartLAeqTimeRunningData.level, this.chartLAeqTimeRunningData.running, this.chartLAeqTimeRunningData.marker]
    this.chartLAeqTimeRunning.layout.datarevision++
    this.chartThirdOctaves.data = [this.chartThirdOctavesData.max, this.chartThirdOctavesData.running, this.chartThirdOctavesData.level, this.chartThirdOctavesData.min]
    this.chartThirdOctaves.layout.datarevision++
    this.chartSonogram.data = [this.chartSonogramData.value, this.chartSonogramData.zeroValue]
    this.chartSonogram.layout.datarevision++
    this.chartFFT.data = [this.chartFFTData.dbA, this.chartFFTData.db]
    this.chartFFT.layout.datarevision++

    this.variabiliService.setDataRefreshBS(new Date())

  }

  aggiornaAssiGrafici() {
    this.chartLAeqTimeRunning.layout.yaxis.range = [this.variabiliService.range.lower, this.variabiliService.range.upper]
    this.chartLAeqTimeRunning.layout.yaxis.dtick = this.creaYaxisDtick()
    // this.chartLAeqTimeRunning.layout.yaxis.labelalias = {[this.variabiliService.range.upper]: 'dBA'}
    this.chartThirdOctaves.layout.yaxis.range = [this.variabiliService.range.lower, this.variabiliService.range.upper]
    this.chartThirdOctaves.layout.yaxis.dtick = this.creaYaxisDtick()
    // this.chartThirdOctaves.layout.yaxis.labelalias = {[this.variabiliService.range.upper]: 'dB'}
    this.chartFFT.layout.yaxis.range = [this.variabiliService.range.lower, this.variabiliService.range.upper]
    this.chartFFT.layout.yaxis.dtick = this.creaYaxisDtick()
    // this.chartFFT.layout.yaxis.labelalias = {[this.variabiliService.range.upper]: 'dBA'}
    this.chartSonogramData.value.zmin = this.variabiliService.range.lower
    this.chartSonogramData.value.zmax = this.variabiliService.range.upper
    this.chartSonogramData.zeroValue.zmin = this.variabiliService.range.lower
    this.chartSonogramData.zeroValue.zmax = this.variabiliService.range.upper

    this.chartLAeqTimeRunning.layout.datarevision++
    this.chartThirdOctaves.layout.datarevision++
    this.chartFFT.layout.datarevision++
    this.chartSonogram.layout.datarevision++
  }

  aggiornaLabelGrafici() {
    // this.chartLAeqTimeRunning.layout.xaxis2.title = this.variabiliService.translation.CHARTS.AXIS_TIME
    // this.chartLAeqTimeRunning.layout.yaxis.title = this.variabiliService.translation.CHARTS.AXIS_DBA
    // this.chartThirdOctaves.layout.xaxis2.title = this.variabiliService.translation.CHARTS.AXIS_FREQUENCY_OCTAVES
    // this.chartThirdOctaves.layout.yaxis.title = this.variabiliService.translation.CHARTS.AXIS_DB
    // this.chartSonogram.layout.xaxis2.title = this.variabiliService.translation.CHARTS.AXIS_TIME
    // this.chartSonogram.layout.yaxis2.title = this.variabiliService.translation.CHARTS.AXIS_FREQUENCY_OCTAVES
    // this.chartFFT.layout.xaxis2.title = this.variabiliService.translation.CHARTS.AXIS_FREQUENCY_FFT
    // this.chartFFT.layout.yaxis.title = this.variabiliService.translation.CHARTS.AXIS_DB_DBA

    this.chartLAeqTimeRunning.layout.datarevision++
    this.chartThirdOctaves.layout.datarevision++
    this.chartSonogram.layout.datarevision++
    this.chartFFT.layout.datarevision++
  }

  aggiornaParametriGrafici() {
    console.log("aggiornaParametriGrafici")

    // chartLAeqTimeRunning
    this.chartLAeqTimeRunningData.level.visible = this.variabiliService.chartParameters['GLOBALS_LAEQ1s']
    this.chartLAeqTimeRunningData.running.visible = this.variabiliService.chartParameters['GLOBALS_LAEQt']
    this.chartLAeqTimeRunning.layout.datarevision++

    // chartThirdOctaves
    this.chartThirdOctavesData.min.visible = this.variabiliService.chartParameters['OCTAVES_LZmin']
    this.chartThirdOctavesData.level.visible = this.variabiliService.chartParameters['OCTAVES_LZEQ1s']
    this.chartThirdOctavesData.running.visible = this.variabiliService.chartParameters['OCTAVES_LZEQt']
    this.chartThirdOctavesData.max.visible = this.variabiliService.chartParameters['OCTAVES_LZmax']
    this.chartThirdOctaves.layout.datarevision++

    // fftChartPlotly
    this.chartFFTData.dbA.visible = this.variabiliService.chartParameters['FFT_LAEQ1s']
    this.chartFFTData.db.visible = this.variabiliService.chartParameters['FFT_LZEQ1s']
    this.chartFFT.layout.datarevision++

  }

  aggiornaDatiGrafici(val: any) {
    console.log("aggiornaDatiGrafici", val)

    // chartLAeqTimeRunning
    this.chartLAeqTimeRunningData.level.y = val.LAeqTimeRunningData.level.y
    this.chartLAeqTimeRunningData.running.y = val.LAeqTimeRunningData.running.y
    this.chartLAeqTimeRunningData.marker.y = val.LAeqTimeRunningData.marker.y

    this.chartLAeqTimeRunning.data = [this.chartLAeqTimeRunningData.level, this.chartLAeqTimeRunningData.running, this.chartLAeqTimeRunningData.marker]
    this.chartLAeqTimeRunning.layout.datarevision++


    // chartThirdOctaves
    this.chartThirdOctavesData.min.y = val.dbBandData.min.y
    this.chartThirdOctavesData.level.y = val.dbBandData.level.y
    this.chartThirdOctavesData.running.y = val.dbBandData.running.y
    this.chartThirdOctavesData.max.y = val.dbBandData.max.y

    this.chartThirdOctaves.data = [this.chartThirdOctavesData.max, this.chartThirdOctavesData.running, this.chartThirdOctavesData.level, this.chartThirdOctavesData.min]
    this.chartThirdOctaves.layout.datarevision++


    // chartSonogram
    this.chartSonogramData.value.x = val.sonogramData.value.x
    this.chartSonogramData.value.y = val.sonogramData.value.y
    this.chartSonogramData.value.z = val.sonogramData.value.z
    this.chartSonogramData.value.zmin = this.variabiliService.range.lower
    this.chartSonogramData.value.zmax = this.variabiliService.range.upper
    this.chartSonogramData.value.z = val.sonogramData.value.z
    this.chartSonogramData.zeroValue.x = val.sonogramData.zeroValue.x
    this.chartSonogramData.zeroValue.y = val.sonogramData.zeroValue.y
    this.chartSonogramData.zeroValue.z = val.sonogramData.zeroValue.z
    this.chartSonogramData.zeroValue.zmin = this.variabiliService.range.lower
    this.chartSonogramData.zeroValue.zmax = this.variabiliService.range.upper

    this.chartSonogram.data = [this.chartSonogramData.value, this.chartSonogramData.zeroValue]
    this.chartSonogram.layout.datarevision++


    // fftChartPlotly
    this.chartFFTData.dbA.x = val.fftData.dbA.x
    this.chartFFTData.db.x = val.fftData.db.x
    this.chartFFTData.dbA.y = val.fftData.dbA.y
    this.chartFFTData.db.y = val.fftData.db.y

    this.chartFFT.data = [this.chartFFTData.dbA, this.chartFFTData.db]
    this.chartFFT.layout.datarevision++
  }

  setColors(color: string) {
    console.log("graficiService.setColors", color)

    if (color == 'dark') {
      // chartLAeqTimeRunning
      this.chartLAeqTimeRunning.layout.plot_bgcolor = this.chartBackgroundColorDark
      this.chartLAeqTimeRunning.layout.paper_bgcolor = this.chartBackgroundColorDark
      this.chartLAeqTimeRunning.layout.font.color = this.chartTextColorDark
      this.chartLAeqTimeRunning.layout.xaxis.gridcolor = this.chartGridColor1
      this.chartLAeqTimeRunning.layout.xaxis2.gridcolor = this.chartGridColor2
      this.chartLAeqTimeRunning.layout.yaxis.gridcolor = this.chartGridColor2
      this.chartLAeqTimeRunning.layout.datarevision++

      // chartThirdOctaves
      this.chartThirdOctaves.layout.plot_bgcolor = this.chartBackgroundColorDark
      this.chartThirdOctaves.layout.paper_bgcolor = this.chartBackgroundColorDark
      this.chartThirdOctaves.layout.font.color = this.chartTextColorDark
      this.chartThirdOctaves.layout.yaxis.gridcolor = this.chartGridColor2
      this.chartThirdOctaves.layout.datarevision++

      // chartSonogram
      this.chartSonogram.layout.plot_bgcolor = this.chartBackgroundColorDark
      this.chartSonogram.layout.paper_bgcolor = this.chartBackgroundColorDark
      this.chartSonogram.layout.font.color = this.chartTextColorDark
      this.chartSonogram.layout.datarevision++

      // chartFFT
      this.chartFFT.layout.plot_bgcolor = this.chartBackgroundColorDark
      this.chartFFT.layout.paper_bgcolor = this.chartBackgroundColorDark
      this.chartFFT.layout.font.color = this.chartTextColorDark
      this.chartFFT.layout.xaxis.gridcolor = this.chartGridColor1
      this.chartFFT.layout.xaxis2.gridcolor = this.chartGridColor1
      this.chartFFT.layout.yaxis.gridcolor = this.chartGridColor2
      this.chartFFT.layout.datarevision++
    } else {
      this.chartLAeqTimeRunning.layout.plot_bgcolor = ''
      this.chartLAeqTimeRunning.layout.paper_bgcolor = ''
      this.chartLAeqTimeRunning.layout.font.color = ''
      this.chartLAeqTimeRunning.layout.xaxis.gridcolor = ''
      this.chartLAeqTimeRunning.layout.xaxis2.gridcolor = this.chartGridColor3
      this.chartLAeqTimeRunning.layout.yaxis.gridcolor = ''
      this.chartLAeqTimeRunning.layout.datarevision++

      // chartThirdOctaves
      this.chartThirdOctaves.layout.plot_bgcolor = ''
      this.chartThirdOctaves.layout.paper_bgcolor = ''
      this.chartThirdOctaves.layout.font.color = ''
      this.chartThirdOctaves.layout.yaxis.gridcolor = ''
      this.chartThirdOctaves.layout.datarevision++

      // chartSonogram
      this.chartSonogram.layout.plot_bgcolor = ''
      this.chartSonogram.layout.paper_bgcolor = ''
      this.chartSonogram.layout.font.color = ''
      this.chartSonogram.layout.datarevision++

      // chartFFT
      this.chartFFT.layout.plot_bgcolor = ''
      this.chartFFT.layout.paper_bgcolor = ''
      this.chartFFT.layout.font.color = ''
      this.chartFFT.layout.xaxis.gridcolor = ''
      this.chartFFT.layout.xaxis2.gridcolor = ''
      this.chartFFT.layout.yaxis.gridcolor = ''
      this.chartFFT.layout.datarevision++
    }


  }

  creaYaxisDtick() {
    var diff = (this.variabiliService.range.upper - this.variabiliService.range.lower)
    if (diff > 50) {
      return 10
    } else if (diff > 20 && diff <= 50) {
      return 5
    } else if (diff > 10 && diff <= 20) {
      return 2
    } else {
      return 1
    }
  }

}
