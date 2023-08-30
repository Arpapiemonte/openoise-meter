import { Injectable } from '@angular/core';

import { VariabiliService } from './variabili.service';
import { AudioCfgService } from './audio-cfg.service';
import { GraficiService } from './grafici.service';
import { FilesystemService } from './filesystem.service';

declare var audioinput: any;
import fft from 'fourier-transform/asm';

import * as moment from 'moment'
import 'moment/locale/it';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  // TIME VARIABLES
  capture: boolean = false
  captureCalibrazione: boolean = false
  pause: boolean = false
  setIntervalCapture: any;
  countInterval: number = 0
  date_start: any
  date_now: any
  elapsedTime: any
  timeElapsed: string = ''

  // NOISE VARIABLES
  p_ref: number = 0.00002;

  thirdOctave: Array<number> = [16, 20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500,
    630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000];

  thirdOctaveLimits = [
    {
      "min": 14.1,
      "band": 16,
      "max": 17.8
    },
    {
      "min": 17.8,
      "band": 20,
      "max": 22.4
    },
    {
      "min": 22.4,
      "band": 25,
      "max": 28.2
    },
    {
      "min": 28.2,
      "band": 31.5,
      "max": 35.5
    },
    {
      "min": 35.5,
      "band": 40,
      "max": 44.7
    },
    {
      "min": 44.7,
      "band": 50,
      "max": 56.2
    },
    {
      "min": 56.2,
      "band": 63,
      "max": 70.8
    },
    {
      "min": 70.8,
      "band": 80,
      "max": 89.1
    },
    {
      "min": 89.1,
      "band": 100,
      "max": 112
    },
    {
      "min": 112,
      "band": 125,
      "max": 141
    },
    {
      "min": 141,
      "band": 160,
      "max": 178
    },
    {
      "min": 178,
      "band": 200,
      "max": 224
    },
    {
      "min": 224,
      "band": 250,
      "max": 282
    },
    {
      "min": 282,
      "band": 315,
      "max": 355
    },
    {
      "min": 355,
      "band": 400,
      "max": 447
    },
    {
      "min": 447,
      "band": 500,
      "max": 562
    },
    {
      "min": 562,
      "band": 630,
      "max": 708
    },
    {
      "min": 708,
      "band": 800,
      "max": 891
    },
    {
      "min": 891,
      "band": 1000,
      "max": 1122
    },
    {
      "min": 1122,
      "band": 1250,
      "max": 1413
    },
    {
      "min": 1413,
      "band": 1600,
      "max": 1778
    },
    {
      "min": 1778,
      "band": 2000,
      "max": 2239
    },
    {
      "min": 2239,
      "band": 2500,
      "max": 2818
    },
    {
      "min": 2818,
      "band": 3150,
      "max": 3548
    },
    {
      "min": 3548,
      "band": 4000,
      "max": 4467
    },
    {
      "min": 4467,
      "band": 5000,
      "max": 5623
    },
    {
      "min": 5623,
      "band": 6300,
      "max": 7079
    },
    {
      "min": 7079,
      "band": 8000,
      "max": 8913
    },
    {
      "min": 8913,
      "band": 10000,
      "max": 11220
    },
    {
      "min": 11220,
      "band": 12500,
      "max": 14130
    },
    {
      "min": 14130,
      "band": 16000,
      "max": 17780
    },
    {
      "min": 17780,
      "band": 20000,
      "max": 22390
    }
  ]

  // number fft
  numberFftTime: number = 0;
  numberFftTotal: number = 0;

  // globalRunning
  linearRunning: number = 0;
  linearARunning: number = 0;
  // linearARunning2: number = 0;
  dbRunning: any = 0
  dbARunning: any = 0
  // dbARunning2: any = 0

  // global Time
  linearTime: number = 0;
  linearATime: number = 0;
  dbTime: number = 0
  dbATime: number = 0
  dbATimeStartMin: number = 0;
  dbATimeStartMax: number = 0;

  // Band Running
  linearBandRunning: Array<number> = [];
  linearBandTime: Array<number> = [];

  // fft
  linearFftTime: Array<number> = [];
  linearAFftTime: Array<number> = [];
  dbFftTime: Array<number> = [];
  dbAFftTime: Array<number> = [];

  onAudio: any;
  firstGoodValueGlobal: number;
  firstGoodValueBand: Array<any> = [];

  // CHART DATA VARIABLES
  LAeqTimeRunningData: any
  dbBandData: any
  sonogramData: any
  fftData: any

  constructor(
    public variabiliService: VariabiliService,
    public audioCfgService: AudioCfgService,
    public graficiService: GraficiService,
    public filesystemService: FilesystemService,
  ) {

  }

  startStopCapture() {
    if (this.capture) {
      this.stopCapture()
    } else {
      this.startAudio()
    }
  }

  startPauseCapture() {
    if (this.pause) {
      this.pause = false
    } else {
      this.pause = true
    }
  }

  startAudio() {
    this.checkPermessi()
  }

  checkPermessi() {
    // First check whether we already have permission to access the microphone.
    var this_copy = this
    audioinput.checkMicrophonePermission(function (hasPermission) {
      if (hasPermission) {
        console.log("We already have permission to record.");
        this_copy.startCapture();
      }
      else {
        // Ask the user for permission to access the microphone
        audioinput.getMicrophonePermission(function (hasPermission, message) {
          if (hasPermission) {
            console.log("User granted us permission to record.");
            this_copy.startCapture();
          } else {
            console.warn("User denied permission to record.");
          }
        });
      }
    });
  }

  startCapture() {
    console.log("startCapture")
    this.capture = true

    this.resetParameters()

    this.date_start = new Date();

    var this_copy = this

    var stop = 0

    this.onAudio = function onAudioInput(evt: any) {
      if (!this_copy.pause) {
        // console.log("evt", evt.data.length)

        // parte nuova rispetto opeNoise 2, vedere txt
        const raw = this_copy.normalizeAudio(evt.data);

        this_copy.numberFftTime += 1;
        this_copy.numberFftTotal += 1;

        // hanning without overlap
        for (let i = 0; i < raw.length; i++) {
          var rad: number = (2 * Math.PI * i) / (this_copy.audioCfgService.bufferFFT - 1);
          var hanning = (1 - Math.cos(rad)) * 0.5;
          raw[i] = raw[i] * hanning;
        }
        stop += 1
        // if (stop < 10) {
        //   console.log("raw", raw);
        // }

        // remember that fft gets an array of bufferFFT/2 elements
        // console.log("prima mag");
        var mag = fft(raw);
        // console.log("mag length", mag.length);
        // console.log('calib home: ' + dbGain)
        // if (stop < 10) {
        //   console.log("mag length", mag.length);
        //   // console.log("mag", mag);
        // }

        var linearGain: number = Math.pow(10, this_copy.variabiliService.dbGain / 10);

        // Bands calculation2
        var calcResult = this_copy.audioCfgService.onBandCalc(this_copy.p_ref, linearGain, this_copy.thirdOctave, mag)
        var linearFftGlobal = calcResult.linearFftGlobal
        var linearAFftGlobal = calcResult.linearAFftGlobal
        var linearBandFft = calcResult.linearBandFft
        var linearFft = calcResult.linearFft
        var linearAFft = calcResult.linearAFft

        // linear level (sum - until setInterval reset)
        this_copy.linearTime += linearFftGlobal;
        this_copy.linearATime += linearAFftGlobal;

        // Linear level running since start (sum)
        this_copy.linearRunning += linearFftGlobal;
        this_copy.linearARunning += linearAFftGlobal;

        // linear level for Band (sum - until setInterval reset)
        for (let i = 0; i < linearBandFft.length; i++) {
          this_copy.linearBandTime[i] += linearBandFft[i];
          this_copy.linearBandRunning[i] += linearBandFft[i];
        }

        // linear level fot fft and AFft
        for (let i = 0; i < linearFft.length; i++) {
          this_copy.linearFftTime[i] += linearFft[i]
          this_copy.linearAFftTime[i] += linearAFft[i]
        }
        // console.log(this_copy.linearFftTime[1000],linearFft[1000])

      }
    } // end onAudioInput


    audioinput.start(this.audioCfgService.config())

    // Listen to audioinput events
    window.addEventListener("audioinput", this.onAudio, false);
    //  Listen to audioinputerror events
    var onAudioInputError = function (error) {
      alert("onAudioInputError event recieved: " + JSON.stringify(error));
    };
    window.addEventListener("audioinputerror", onAudioInputError, false);

    this.inizializzaData()

    // calculate data every sec
    this.setIntervalCapture = setInterval(function () {

      // console.log("this_copy.date_start",this_copy.date_start)
      this_copy.date_now = new Date()
      // this_copy.date_now.setSeconds(this_copy.date_start.getSeconds() + this_copy.countInterval); 
      // console.log("this_copy.date_now",this_copy.date_now)
      this_copy.countInterval++

      if (!this_copy.pause) {
        console.log("this_copy.numberFftTime", this_copy.numberFftTime)
        console.log("this_copy.numberFftTotal", this_copy.numberFftTotal)
        // console.log("this_copy.variabiliService.linearARunning", this_copy.linearARunning)

        // LAeq in time e LAeqRunning
        this_copy.dbTime = 10 * Math.log10(this_copy.linearTime / this_copy.numberFftTime);
        this_copy.dbATime = 10 * Math.log10(this_copy.linearATime / this_copy.numberFftTime);
        this_copy.dbRunning = 10 * Math.log10(this_copy.linearRunning / this_copy.numberFftTotal);
        this_copy.dbARunning = 10 * Math.log10(this_copy.linearARunning / this_copy.numberFftTotal);

        // prova calcolo dbARunning2 a partire da dbATime
        // if (this_copy.countInterval > 0) {
        //   // console.log("this_copy.linearARunning2", this_copy.linearARunning2)
        //   this_copy.linearARunning2 += 10 ** (this_copy.dbATime / 10)
        //   // console.log("this_copy.dbATime ", this_copy.dbATime)
        //   // console.log("10 ** (this_copy.dbATime / 10)", 10 ** (this_copy.dbATime / 10))
        //   // console.log("this_copy.linearARunning2", this_copy.linearARunning2)
        //   // console.log("this_copy.linearARunning2 / this_copy.countInterval", this_copy.linearARunning2 / this_copy.countInterval)
        //   this_copy.dbARunning2 = 10 * Math.log10(this_copy.linearARunning2 / this_copy.countInterval);
        // }
        // // console.log("this_copy.countInterval ", this_copy.countInterval)
        // // console.log("this_copy.dbARunning2 ", this_copy.dbARunning2)

        this_copy.LAeqTimeRunningData.level.y.shift()
        this_copy.LAeqTimeRunningData.running.y.shift()
        this_copy.LAeqTimeRunningData.level.y.push(this_copy.dbATime)
        this_copy.LAeqTimeRunningData.running.y.push(this_copy.dbARunning)

        // Min and max global levels since start
        if (!isNaN(this_copy.dbATime)) {
          // console.log('non è NaN')
          if (this_copy.firstGoodValueGlobal == 0) {
            this_copy.dbATimeStartMin = this_copy.dbATime;
            this_copy.dbATimeStartMax = this_copy.dbATime;
            this_copy.firstGoodValueGlobal = 1
          } else {
            if (this_copy.dbATime < this_copy.dbATimeStartMin) {
              this_copy.dbATimeStartMin = this_copy.dbATime;
            }
            if (this_copy.dbATime > this_copy.dbATimeStartMax) {
              this_copy.dbATimeStartMax = this_copy.dbATime;
            }
          }
        }
        // commentato tutto in analogia alla parte dei dbBand
        if (isNaN(this_copy.dbTime)) {
          this_copy.dbTime = 0;
        }
        if (isNaN(this_copy.dbATime)) {
          this_copy.dbATime = 0;
        }
        if (isNaN(this_copy.dbARunning)) {
          this_copy.dbARunning = 0;
        }
        // console.log(this_copy.linearBandRunning)
        // console.log(this_copy.numberFftTotal)

        // dbBandData and z for sonogramData
        var dbBand = 0
        var dbBandrunning = 0
        var dbBandLevelTemp = []
        var dbBandRunningTemp = []
        // console.log("this_copy.firstGoodValueBand", this_copy.firstGoodValueBand)
        // console.log("this_copy.linearBandTime", this_copy.linearBandTime)
        for (let i = 0; i < this_copy.linearBandTime.length; i++) {

          // dbBandData
          dbBand = 10 * Math.log10(this_copy.linearBandTime[i] / this_copy.numberFftTime)
          dbBandrunning = 10 * Math.log10(this_copy.linearBandRunning[i] / this_copy.numberFftTotal)

          if (!isNaN(dbBand)) { //  && dbBand > 0
            // min
            if (this_copy.firstGoodValueBand[i] == 0) {
              this_copy.dbBandData.min.y[i] = dbBand;
              this_copy.firstGoodValueBand[i] = 1
            } else {
              if (dbBand < this_copy.dbBandData.min.y[i]) {
                this_copy.dbBandData.min.y[i] = dbBand
              }
            }
            // max
            if (dbBand > this_copy.dbBandData.max.y[i]) {
              this_copy.dbBandData.max.y[i] = dbBand
            }
          }
          if (isNaN(dbBand)) {
            dbBand = 0;
          }
          if (isNaN(dbBandrunning)) {
            dbBandrunning = 0;
          }

          dbBandLevelTemp.push(dbBand)
          dbBandRunningTemp.push(dbBandrunning)

          this_copy.linearBandTime[i] = 0;

          // z for sonogramData
          this_copy.sonogramData.value.z[i].shift()
          this_copy.sonogramData.value.z[i].push(dbBand)
        }
        this_copy.dbBandData.level.y = dbBandLevelTemp
        this_copy.dbBandData.running.y = dbBandRunningTemp

        // fftData
        for (let i = 0; i < this_copy.linearFftTime.length; i++) {
          this_copy.dbFftTime[i] = 10 * Math.log10(this_copy.linearFftTime[i] / this_copy.numberFftTime)
          this_copy.dbAFftTime[i] = 10 * Math.log10(this_copy.linearAFftTime[i] / this_copy.numberFftTime)
          this_copy.linearFftTime[i] = 0
          this_copy.linearAFftTime[i] = 0
        }
        this_copy.fftData.dbA.y = this_copy.dbAFftTime
        this_copy.fftData.db.y = this_copy.dbFftTime

        // grafici
        if (!this_copy.captureCalibrazione) {
          this_copy.graficiService.aggiornaDatiGrafici({
            "LAeqTimeRunningData": this_copy.LAeqTimeRunningData,
            "dbBandData": this_copy.dbBandData,
            "sonogramData": this_copy.sonogramData,
            "fftData": this_copy.fftData
          })
          console.log("this_copy.sonogramData", this_copy.sonogramData)
        }

        this_copy.elapsedTime = this_copy.elapsedTimeCalculation(this_copy.date_start, this_copy.date_now)

        this_copy.variabiliService.setDataRefreshBS(this_copy.date_now)

        if (this_copy.countInterval > 1) {
          if (this_copy.filesystemService.saveData) {
            let data = moment(this_copy.date_now).format("DD/MM/YYYY") + this_copy.variabiliService.saveOptions.field + moment(this_copy.date_now).format("HH:mm:ss.SSS")
            data = data + this_copy.variabiliService.saveOptions.field + this_copy.dbARunning.toFixed(1).replace(".", this_copy.variabiliService.saveOptions.decimal)
            data = data + this_copy.variabiliService.saveOptions.field + this_copy.dbATime.toFixed(1).replace(".", this_copy.variabiliService.saveOptions.decimal)
            // data = data + this_copy.variabiliService.saveOptions.field + this_copy.dbARunning2.toFixed(1).replace(".", this_copy.variabiliService.saveOptions.decimal)
            if (this_copy.variabiliService.saveOptions.bandLZeq) {
              data = data + this_copy.variabiliService.saveOptions.field + this_copy.dbRunning.toFixed(1).replace(".", this_copy.variabiliService.saveOptions.decimal)
              data = data + this_copy.variabiliService.saveOptions.field + this_copy.dbTime.toFixed(1).replace(".", this_copy.variabiliService.saveOptions.decimal)
              for (let el of this_copy.dbBandData.level.y) {
                data = data + this_copy.variabiliService.saveOptions.field + el.toFixed(1).replace(".", this_copy.variabiliService.saveOptions.decimal)
              }
            }
            if (this_copy.variabiliService.saveOptions.bandLZmin) {
              for (let elmin of this_copy.dbBandData.min.y) {
                data = data + this_copy.variabiliService.saveOptions.field + elmin.toFixed(1).replace(".", this_copy.variabiliService.saveOptions.decimal)
              }
            }
            this_copy.filesystemService.appendFile(
              this_copy.filesystemService.nameFileWriting,
              data
            )
          }
        }

        this_copy.numberFftTime = 0;
        this_copy.linearTime = 0;
        this_copy.linearATime = 0;

      } else {

        this_copy.variabiliService.setDataRefreshBS(this_copy.date_now)
        if (this_copy.filesystemService.saveData) {
          let data = moment(this_copy.date_now).format("DD/MM/YYYY") + this_copy.variabiliService.saveOptions.field + moment(this_copy.date_now).format("HH:mm:ss")
          data = data + this_copy.variabiliService.saveOptions.field
          data = data + this_copy.variabiliService.saveOptions.field
          // data = data + this_copy.variabiliService.saveOptions.field
          if (this_copy.variabiliService.saveOptions.bandLZeq) {
            data = data + this_copy.variabiliService.saveOptions.field
            data = data + this_copy.variabiliService.saveOptions.field
            for (let el of this_copy.dbBandData.level.y) {
              data = data + this_copy.variabiliService.saveOptions.field
            }
          }
          if (this_copy.variabiliService.saveOptions.bandLZmin) {
            for (let elmin of this_copy.dbBandData.min.y) {
              data = data + this_copy.variabiliService.saveOptions.field
            }
          }
          this_copy.filesystemService.appendFile(
            this_copy.filesystemService.nameFileWriting,
            data
          )
        }

      }

    }, 1000)

  }

  stopCapture() {
    this.capture = false
    audioinput.stop()
    clearInterval(this.setIntervalCapture)
    this.pause = false
  }

  normalizeAudio(pcmData: any) {
    return Float32Array.from(pcmData, (i: any) => {
      return parseFloat(i) / 32767.0;
    });
  }

  resetParameters() {

    this.date_start = ''
    this.date_now = ''
    this.elapsedTime = ''

    this.countInterval = 0

    this.numberFftTime = 0;
    this.numberFftTotal = 0;
    this.linearRunning = 0;
    this.linearARunning = 0;
    this.dbRunning = 0;
    this.dbARunning = 0;
    // this.linearARunning2 = 0;
    // this.dbARunning2 = 0;
    this.linearTime = 0
    this.linearATime = 0
    this.dbTime = 0;
    this.dbATime = 0;
    this.dbATimeStartMin = 0;
    this.dbATimeStartMax = 0;
    this.linearBandTime = []
    this.linearFftTime = []
    this.linearAFftTime = []
    for (let i = 0; i < this.thirdOctave.length; i++) {
      this.linearBandRunning[i] = 0
    }

    this.firstGoodValueGlobal = 0
    for (let i = 0; i < this.thirdOctave.length; i++) {
      this.firstGoodValueBand[i] = 0
    }
    this.variabiliService.setDataRefreshBS(new Date())

    // parte per il taglio delle frequenze impostate dall'utente
    this.audioCfgService.actualFreqMin = 0
    this.audioCfgService.actualFreqMax = 22390
    for (let b of this.thirdOctaveLimits) {
      if (b.band == this.variabiliService.rangeFreqHz.lower) {
        this.audioCfgService.actualFreqMin = b.min
      }
      if (b.band == this.variabiliService.rangeFreqHz.upper) {
        this.audioCfgService.actualFreqMax = b.max
      }
    }

  }

  reset() {
    if (this.capture) {
      clearInterval(this.setIntervalCapture)
      if (this.pause) {
        this.graficiService.inizializzaGrafici()
      }
      audioinput.stop()
      this.startCapture()
    } else {
      this.resetParameters()
      this.graficiService.inizializzaGrafici()
    }
  }

  elapsedTimeCalculation(date_start: any, date_end: any) {
    console.log("elapsedTimeCalculation date_start", date_start)
    console.log("elapsedTimeCalculation date_end", date_end)
    var output = ''

    if (date_start != '' && date_end != '') {
      var diff = (date_end.getTime() - date_start.getTime()) / 1000;
      diff = Math.abs(Math.floor(diff));

      var years = Math.floor(diff / (365 * 24 * 60 * 60));
      var leftSec = diff - years * 365 * 24 * 60 * 60;

      var month = Math.floor(leftSec / ((365 / 12) * 24 * 60 * 60));
      leftSec = leftSec - month * (365 / 12) * 24 * 60 * 60;

      var days = Math.floor(leftSec / (24 * 60 * 60));
      leftSec = leftSec - days * 24 * 60 * 60;

      var hrs = Math.floor(leftSec / (60 * 60));
      leftSec = leftSec - hrs * 60 * 60;

      var min = Math.floor(leftSec / (60));
      leftSec = leftSec - min * 60;

      var outputHMS = hrs.toLocaleString(undefined, { minimumIntegerDigits: 2 }) + ":" + min.toLocaleString(undefined, { minimumIntegerDigits: 2 }) + ":" + leftSec.toLocaleString(undefined, { minimumIntegerDigits: 2 });
      
      if (days > 0) {
        output = days + " " + this.variabiliService.translation.LEVELS.DAYS + " " + outputHMS
      } else {
        output = outputHMS
      }
      console.log("output elapsedTimeCalculation", output)
    }

    return output

  }

  inizializzaData() {
    console.log("inizializzaData")

    var ticksTotal: number = this.variabiliService.numberSec * 1000 / this.variabiliService.time;
    var ticksDelta: number = this.variabiliService.numberSec / ticksTotal;

    this.LAeqTimeRunningData = {
      level: { x: [], y: [] },
      running: { x: [], y: [] },
    }

    this.dbBandData = {
      min: { x: [], y: [] },
      level: { x: [], y: [] },
      max: { x: [], y: [] },
      running: { x: [], y: [] },
    }

    this.sonogramData = {
      value: { x: [], y: [], z: [] },
      zeroValue: { x: [], y: [], z: [] }
    }

    this.fftData = {
      dbA: { x: [], y: [] },
      db: { x: [], y: [] },
    }

    // LAeq variables and x value for sonogramData
    for (let i = 0; i < ticksTotal + 1; i++) {
      var x_value = - this.variabiliService.numberSec + i * ticksDelta;

      this.LAeqTimeRunningData.level.x.push(x_value)
      this.LAeqTimeRunningData.running.x.push(x_value)
      this.LAeqTimeRunningData.level.y.push(0)
      this.LAeqTimeRunningData.running.y.push(0)

      // x value for sonogramData
      this.sonogramData.value.x.push(x_value)
      this.sonogramData.zeroValue.x.push(x_value)
    }

    // Third Octaves variables and y value for sonogramData
    var thirdOctavesNumber = 0
    for (let i = 0; i < this.thirdOctave.length; i++) {
      this.dbBandData.min.x.push(thirdOctavesNumber)
      this.dbBandData.min.y.push(0)
      this.dbBandData.level.x.push(thirdOctavesNumber)
      this.dbBandData.level.y.push(0)
      this.dbBandData.max.x.push(thirdOctavesNumber)
      this.dbBandData.max.y.push(0)
      this.dbBandData.running.x.push(thirdOctavesNumber)
      this.dbBandData.running.y.push(0)

      // y value for sonogramData
      this.sonogramData.value.y.push(thirdOctavesNumber)
      this.sonogramData.zeroValue.y.push(thirdOctavesNumber)

      thirdOctavesNumber++
    }

    // z value for sonogramData
    for (let i = 0; i < this.thirdOctave.length; i++) {
      var zElement = []
      for (let i = 0; i < ticksTotal + 1; i++) {
        zElement.push(0)
      }
      this.sonogramData.value.z.push(zElement)
      this.sonogramData.zeroValue.z.push(zElement)
    }


    for (let i = 0; i < this.audioCfgService.bufferFFT_all_platform / 2; i++) {
      this.fftData.dbA.x.push(i * this.audioCfgService.freqResolution + this.audioCfgService.freqResolution)
      this.fftData.db.x.push(i * this.audioCfgService.freqResolution + this.audioCfgService.freqResolution)
      this.fftData.dbA.y.push(0)
      this.fftData.db.y.push(0)
    }

  }


}
