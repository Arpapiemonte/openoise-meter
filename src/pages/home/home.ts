import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

// module downloaded
declare var audioinput:any;
import fft from 'fourier-transform/asm';
import moment from 'moment'
import 'moment/locale/it';
import { AppPreferences } from '@ionic-native/app-preferences';
import { File } from '@ionic-native/file';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { TranslateService } from '@ngx-translate/core';

// module written
import { elapsedTime } from './elapsedTime';
import { audioCfg } from './audioCfg';
import { onBandCalc } from './onBandCalc';
import { chartSimple } from './chartSimple';
import { chartLAeqRunning } from './chartLAeqRunning';
import { chartThirdOctaves } from './chartThirdOctaves';
import { chartSonogram } from './chartSonogram';
import { chartFFT } from './chartFFT';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

    // elements in the home html
    home_timeStart:string = '';
    home_timeElapsed:string = '';
    home_dbATime:string = '';
    home_dBARunning:string = '';
    home_date_now:string = '';
    home_numberFftTotal:number = 0;
    home_numberFftSec:number = 0;
    home_dbATimeStartMin:string = '';
    home_dbATimeStartMax:string = '';
    home_maxBand:string = '';
    home_maxBandLabel:string = '';
    configuration:string = '';
    home_timeRefresh:number  = 0;
    home_save_label:string = '';
    save:boolean = false;
    simpleView: boolean = true;
    advanceView: boolean = false;
    // testo_da_raw: any;
    // db_da_raw: number;

    // PREFERENCES
    styleSimple:boolean = false;
    styleAdvanced:boolean = false;
    languageValue:any;
    savingShow:boolean = false;
    range:any = {};

    exitShow:boolean = true;

    // translation
    translation:any;

    // VARIABLES
    freqResolution:number;
    linearARunning:number = 0;
    dbATimeStartMin:number = 0;
    dbATimeStartMax:number = 0;
    dbBand:Array<any> = [];
    linearBandRunning:Array<number> = [];
    dbBandRunning:Array<any> = [];
    numberFftTotal:number = 0;
    dbFftTime:Array<number> = [];
    dbAFftTime:Array<number> = [];
    refreshView:any;
    date_start = new Date();
    chartToView:any = "LAeqRunning";
    dirPath:any;
    fileName:any;
    fileCreated:boolean = false;
    calib:any;
    // capture:any;
    onAudio:any;
    firstGoodValueGlobal:number;
    firstGoodValueBand:Array<any> = [];

    thirdOctaveLabels:Array<string> = ["16", "20", "25", "31.5", "40", "50", "63", "80", "100", "125", "160", "200", "250", "315", "400", "500",
    "630", "800", "1000", "1250", "1600", "2000", "2500", "3150", "4000", "5000", "6300", "8000", "10000", "12500", "16000", "20000"];
    thirdOctave:Array<number> = [16, 20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500,
        630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000];


    constructor(public navCtrl: NavController, public platform: Platform,
                private appPreferences: AppPreferences, private file: File,
                private screenOrientation: ScreenOrientation,
                public alertCtrl: AlertController, public translateService: TranslateService,
                public toastCtrl: ToastController
                ) {

        this.navCtrl;

        this.platform.ready().then(() => {

            // console.log('home ready')

            orientation()
;

            // exit buttons
            if (this.platform.is('android')) {
              this.exitShow = true;
            }
            if (this.platform.is('ios')) {
              this.exitShow = false;
            }

            var this_copy = this;

            // VARIABLES-PREFERENCES
            // style
            this.appPreferences.fetch('style').then((res) => {
                if (res == 'simple') {
                  this.styleSimple = true
                }
                if (res == 'advanced') {
                  this.styleAdvanced = true
                }
                // if style was not set before
                if (res == null || res == "") {
                  this.styleAdvanced = true
                }
              });

              // get range preference
              this.appPreferences.fetch('range_min').then((res) => {

                  if (isNaN(res) || res == null || res == "") {
                      this.appPreferences.store("range_min", "0");
                      this.range["lower"] = 0
                  } else {
                    this.range["lower"] = parseInt(res)
                  }
                  });

              this.appPreferences.fetch('range_max').then((res) => {
                  // console.log('range', res)
                  if (isNaN(res) || res == null || res == "") {
                  this.appPreferences.store("range_max", "110");
                  this.range["upper"] = 110
              } else {
                this.range["upper"] =  parseInt(res)
              }
                  });

            // saving
            this.appPreferences.fetch('saving').then((res) => {
                if (res == 'true') {
                  this.savingShow = true
                } else {
                  this.savingShow = false
                }
              });

            // get language preference
            this.appPreferences.fetch('language').then((res) => {

              if (res == 'en') {
                  this_copy.languageValue = "English"
                  this_copy.home_timeStart = moment().locale('en').format('ddd YYYY/MM/DD HH:mm:ss');// + '.' + mm.toLocaleString(undefined, {minimumIntegerDigits: 3});
              }
              if (res == 'it') {
                  this_copy.languageValue = "Italiano"
                  this_copy.home_timeStart = moment().locale('it').format('ddd DD/MM/YYYY HH:mm:ss');// + '.' + mm.toLocaleString(undefined, {minimumIntegerDigits: 3});
              }

              });

            this.translateService.stream('HOME').subscribe((res: any) => {
                        this.translation = res
                        this.home_save_label = res.SAVE_LABEL
                    });

            // gain
            var dbGain:number = 0;
            var linearGain:number = 1;

            this.appPreferences.fetch('calibration').then((res) => {
                if (isNaN(res) || res == null || res == "") {
                    this.appPreferences.store("calibration", "0");
                } else {
                    dbGain = parseFloat(res);
                    linearGain = Math.pow(10, dbGain / 10);
                    this.calib = dbGain;
                }
                });


            // refresh time (ms)
            var time:number = 1000;
            // pression reference
            var p_ref:number  = 0.00002;

            // set audio capture configuration
            var capture = new audioCfg(this);
            var bufferFFT = capture.bufferFFT;
            this.freqResolution = capture.freqResolution;

            for (let i = 0; i < this.thirdOctave.length; i++)  {
                this_copy.linearBandRunning[i] = 0;
            }

            // start audioinput
            window.setTimeout(function(){audioinput.start(capture.captureCfg)}, 500);

            var numberFftTime:number = 0;
            var linearATime:number = 0;
            var linearBandTime:Array<number> = [];
            var linearFftTime:Array<number> = [];
            var linearAFftTime:Array<number> = [];

            this.onAudio = function onAudioInput( evt ) {
                // 'evt.data' is an integer array containing raw audio data

                numberFftTime += 1;
                this_copy.numberFftTotal += 1;

                // hanning without overlap
                for (let i = 0; i < evt.data.length; i++)  {

                    var rad: number = (2 * Math.PI * i) / (bufferFFT - 1);
                    var hanning = (1 - Math.cos(rad)) * 0.5;
                    evt.data[i] = evt.data[i] * hanning;

                }
                // console.log(evt.data);

                // remember that fft gets an array of bufferFFT/2 elements
                var mag = fft(evt.data);

                // console.log('calib home: ' + dbGain)

                // Bands calculation
                var onBandCalcResults = new onBandCalc(p_ref,linearGain,this_copy.thirdOctave,bufferFFT,this_copy.freqResolution,mag);
                var linearAFftGlobal = onBandCalcResults.linearAFftGlobal;
                var linearBandFft = onBandCalcResults.linearBandFft;
                // this_copy.dbFftTime = onBandCalcResults.dbFftTime;
                // this_copy.dbAFftTime = onBandCalcResults.dbAFftTime;

                var linearFft = onBandCalcResults.linearFft
                var linearAFft = onBandCalcResults.linearAFft
                console.log(linearFft.length)
                for (let i = 0; i < linearFft.length; i++)  {
                  linearFftTime[i] += linearFft[i]
                  linearAFftTime[i] += linearAFft[i]
                }
                // console.log(linearFftTime[1000],linearFft[1000])

                // Bands levels (db) for FFT
                // var dbBandFft:Array<number> = [];
                // for (let i = 0; i < linearBandFft.length; i++)  {
                //     dbBandFft[i] =  (10 * Math.log10(linearBandFft[i]));
                // }

                // linear level (sum - until setInterval reset)
                linearATime += linearAFftGlobal;
                // linear level for Band (sum - until setInterval reset)
                for (let i = 0; i < linearBandFft.length; i++)  {
                    linearBandTime[i] += linearBandFft[i];
                    this_copy.linearBandRunning[i] += linearBandFft[i];
                }
                // Linear level running since start (sum)
                this_copy.linearARunning += linearAFftGlobal;


            }  // end onAudioInput

            ///////// part for audioinput
            // Listen to audioinput events
            window.addEventListener( "audioinput", this.onAudio, false );

            var onAudioInputError = function( error ) {
                alert( "onAudioInputError event recieved: " + JSON.stringify(error) );
            };

            // Listen to audioinputerror events
            window.addEventListener( "audioinputerror", onAudioInputError, false );
            ///////// end part for audioinput

            /// part for home button press
            document.addEventListener("pause", function() {
                // console.log('pause')
                if (this_copy.platform.is('ios')) {
                  this_copy.save = false
                  this_copy.reset()
                }
                //code for action on pause
                // if (audioinput.isCapturing()){
                //     audioinput.stop()
                //     window.removeEventListener( "audioinput", this_copy.onAudio, false );
                // }
               }, false);
            document.addEventListener("resume", function() {
                // console.log('resume')
                if (this_copy.platform.is('ios')) {
                    this_copy.reset()
                }
                //code for action on resume
                // if (!audioinput.isCapturing()){
                //     audioinput.start(capture.captureCfg)
                //     this_copy.onAudio
                // }
            }, false);
            /// end part for home button press

            /// CHARTS
            // chart time variables
            var numberSec:number = 30;
            var ticksTotal:number = numberSec * 1000 / time;
            var ticksDelta:number = numberSec / ticksTotal;


            // chart Simple variables
            var cSimple:any;
            var cSimpleStatus = 0;


            // chart LAeq variables
            var dbARunningChart:Array<any> = [];
            var dbARunningChartLabels:Array<any> = [];
            var dbATimeChart:Array<any> = [];
            for (let i = 0; i < ticksTotal + 1; i++)  {
                var x_value = - numberSec + i * ticksDelta;
                dbARunningChart[i] = {x:x_value,y:0};
                dbATimeChart[i]= {x:x_value,y:0};
            }
            for (let i = 0; i < ticksTotal; i++)  {
                dbARunningChartLabels[i] = Number((i/10 - numberSec).toFixed(1));
            }
            var cLAeqRunning:any;
            var cLAeqRunningStatus = 0;

            // chart Third Octaves variables
            for (let i = 0; i < this_copy.thirdOctaveLabels.length; i++)  {
                this_copy.dbBand[i] =  {
                    band: this_copy.thirdOctaveLabels[i],
                    level: 0,
                    min: 0,
                    max: 0,
                    running: 0
                }
            }
            var cThirdOctaves:any;
            var cThirdOctavesStatus = 0;

            // chart Sonogram variables
            var dbBandTimeSonogram:Array<any> = [];
            for (let i = 0; i < ticksTotal + 1; i++)  {
                var x_value = - numberSec + i * ticksDelta;
                var dbBandTimeSonogramElement:Array<any> = []
                for (let b = 0; b < this_copy.thirdOctaveLabels.length; b++)  {
                    dbBandTimeSonogramElement[b] = {
                        band: this_copy.thirdOctaveLabels[b],
                        level: 0
                    }
                }
                dbBandTimeSonogram[i] = {
                    time: x_value,
                    data: dbBandTimeSonogramElement
                }
            }
            var cSonogram:any;
            var cSonogramStatus = 0;

            // FFT chart
            var dbFftChart:Array<any> = [];
            var dbAFftChart:Array<any> = [];
            var cFft:any;
            var cFftStatus = 0;


            /// end CHARTS



            // global variables
            var dbATime:number = 0
            var dbARunning:number = 0
            var date_last = this.date_start;
            this.firstGoodValueGlobal = 0
            for (let i = 0; i < this_copy.thirdOctaveLabels.length; i++)  {
                this.firstGoodValueBand[i] = 0
            }


            // refresh view every 'time'
            this.refreshView = setInterval(function(){

                var date_now = new Date;

                // var roundedSec = (Number(date_now.getSeconds().toLocaleString(undefined, {minimumIntegerDigits: 2}) + '.' +
                //                  date_now.getMilliseconds().toLocaleString(undefined, {minimumIntegerDigits: 3}))).toFixed(0)


                // Add data in lineToWrite
                var lineToWrite =  date_now.getFullYear() + '-' +
                                (date_now.getMonth()+1).toLocaleString(undefined, {minimumIntegerDigits: 2}) + '-' +
                                date_now.getDate().toLocaleString(undefined, {minimumIntegerDigits: 2}) + ' ' +
                                date_now.getHours().toLocaleString(undefined, {minimumIntegerDigits: 2}) +  ':' +
                                date_now.getMinutes().toLocaleString(undefined, {minimumIntegerDigits: 2}) + ':' +
                                date_now.getSeconds().toLocaleString(undefined, {minimumIntegerDigits: 2}) + '.' +
                                date_now.getMilliseconds().toLocaleString(undefined, {minimumIntegerDigits: 3});


                // LAeq in time
                dbATime = 10 * Math.log10(linearATime/numberFftTime);

                // Add LAeq in lineToWrite
                lineToWrite = lineToWrite + ' ' + dbATime.toFixed(1)

                // Min and max global levels since start
                if (isNaN(dbATime)) {
                  this_copy.dbATimeStartMin = 0;
                  this_copy.dbATimeStartMax = 0;
                } else {
                  // console.log('non è NaN')
                  if (this_copy.firstGoodValueGlobal == 0) {
                    this_copy.dbATimeStartMin = dbATime;
                    this_copy.dbATimeStartMax = dbATime;
                    this_copy.firstGoodValueGlobal = 1
                  } else {
                    if (dbATime < this_copy.dbATimeStartMin) {
                        this_copy.dbATimeStartMin = dbATime;
                    }
                    if (dbATime > this_copy.dbATimeStartMax) {
                        this_copy.dbATimeStartMax = dbATime;
                    }
                  }
                }


                linearATime = 0;

                var maxBand:number = 0;
                var maxBandLabel:string = '';

                // console.log(this_copy.linearBandRunning)
                // console.log(this_copy.numberFftTotal)

                for (let i = 0; i < linearBandTime.length; i++)  {
                    this_copy.dbBand[i].band = this_copy.thirdOctaveLabels[i];
                    this_copy.dbBand[i].level = 10 * Math.log10(linearBandTime[i]/numberFftTime);
                    this_copy.dbBand[i].running = 10 * Math.log10(this_copy.linearBandRunning[i]/this_copy.numberFftTotal);

                    // Add bands in lineToWrite
                    lineToWrite = lineToWrite + ' ' + this_copy.dbBand[i].level.toFixed(1);

                    if (this_copy.dbBand[i].level < 0 || isNaN(this_copy.dbBand[i].level)) {
                        this_copy.dbBand[i].level = 0;
                    }

                    if (!isNaN(this_copy.dbBand[i].level) && this_copy.dbBand[i].level > 0) {
                      // min
                      if (this_copy.firstGoodValueBand[i] == 0) {
                          this_copy.dbBand[i].min = this_copy.dbBand[i].level;
                          this_copy.firstGoodValueBand[i] = 1
                      } else {
                         if (this_copy.dbBand[i].level < this_copy.dbBand[i].min) {
                              this_copy.dbBand[i].min = this_copy.dbBand[i].level;
                          }
                      }
                      // max
                      if (this_copy.dbBand[i].level  > this_copy.dbBand[i].max) {
                          this_copy.dbBand[i].max = this_copy.dbBand[i].level;
                      }
                    }


                    linearBandTime[i] = 0;

                    if (i == 0) {
                        maxBand = this_copy.dbBand[0].level;
                        maxBandLabel = this_copy.dbBand[0].band;
                    } else {
                        if (maxBand < this_copy.dbBand[i].level) {
                            maxBand = this_copy.dbBand[i].level;
                            maxBandLabel = this_copy.dbBand[i].band;
                        }
                    }
                }


                // first second set 0 to all dbBand.running to avoid noise in the start
                if (this_copy.numberFftTotal < 12) {
                  for (let i = 0; i < this_copy.thirdOctaveLabels.length; i++)  {
                      this_copy.dbBand[i].running = 0
                      this_copy.linearBandRunning[i] = 0
                  }
                }
                // console.log(this_copy.dbBand[0].band,this_copy.dbBand[0].running,this_copy.dbBand[0].level ,this_copy.numberFftTotal)

                if (this_copy.save == true){
                    if (this_copy.fileCreated == false) {
                        createFile()
                    } else {
                        writeFile(this_copy.dirPath,this_copy.fileName,lineToWrite + '\n')
                    }
                } else {
                  if (document.getElementById('save_label') != null) {
                    document.getElementById('save_label').style.fontSize = "medium";
                  }

                  this_copy.home_save_label = this_copy.translation.SAVE_LABEL

                  this_copy.fileCreated = false
                }


                dbARunning = 10 * Math.log10(this_copy.linearARunning/this_copy.numberFftTotal);

                // FFT time
                for (let i = 0; i < linearFftTime.length; i++)  {
                  this_copy.dbFftTime[i] = 10 * Math.log10(linearFftTime[i]/numberFftTime)
                  this_copy.dbAFftTime[i] = 10 * Math.log10(linearAFftTime[i]/numberFftTime)
                  linearFftTime[i] = 0
                  linearAFftTime[i] = 0
                }

                // console.log("numberFftTime",numberFftTime)
                // console.log(linearFftTime)
                // console.log(this_copy.dbFftTime)

                // populating home variables
                if (!isNaN(dbATime)) {
                  this_copy.home_dbATime = dbATime.toFixed(1);
                  this_copy.home_dBARunning = dbARunning.toFixed(1);
                  this_copy.home_dbATimeStartMin = this_copy.dbATimeStartMin.toFixed(1);
                  this_copy.home_dbATimeStartMax = this_copy.dbATimeStartMax.toFixed(1);
                }

                // DEBUG VARIABLEs
                // this_copy.home_numberFftTotal = this_copy.numberFftTotal;
                // this_copy.home_maxBand = maxBand.toFixed(1);
                // this_copy.home_maxBandLabel = maxBandLabel;
                // this_copy.home_numberFftSec = numberFftTime;
                numberFftTime = 0;

                var mm = date_now.getMilliseconds();
                this_copy.home_date_now = moment().format('HH:mm:ss') + '.' + mm.toLocaleString(undefined, {minimumIntegerDigits: 3});

                this_copy.home_timeElapsed = elapsedTime(this_copy.date_start,date_now).replace("days", this_copy.translation.DAYS);


                // time debug
                var diff = (date_now.getTime() - date_last.getTime());
                this_copy.home_timeRefresh = diff;
                date_last = date_now;


                // chart LAeq Running data update
                for (let i = 0; i < ticksTotal + 1; i++)  {

                    if (isNaN(dbARunning)){
                        dbARunning = 0;
                    }
                    if (isNaN(dbATime)){
                        dbATime = 0;
                    }

                    if (i < ticksTotal){
                        var x_value = - numberSec + i * ticksDelta;
                        dbARunningChart[i] = {x:x_value,y:dbARunningChart[i+1].y};
                        dbATimeChart[i] =  {x:x_value,y:dbATimeChart[i+1].y};

                    } else if (i == ticksTotal){
                        var x_value = - numberSec + i * ticksDelta;
                        dbARunningChart[i] = {x:x_value,y:dbARunning.toFixed(1)};
                        dbATimeChart[i]= {x:x_value,y:dbATime.toFixed(1)};;
                    }
                }

                // chart Sonogram data update
                if (!isNaN(dbATime)) {
                    for (let i = 0; i < ticksTotal + 1; i++)  {
                        if (i < ticksTotal){
                            var x_value = - numberSec + i * ticksDelta;
                            var dbBandTimeSonogramElement:Array<any> = []
                            for (let b = 0; b < this_copy.thirdOctaveLabels.length; b++)  {
                                dbBandTimeSonogramElement[b] = {
                                    band: this_copy.thirdOctaveLabels[b],
                                    level: dbBandTimeSonogram[i+1].data[b].level
                                }
                            }
                            dbBandTimeSonogram[i] = {
                                time: x_value,
                                data: dbBandTimeSonogramElement
                            }
                        } else if (i == ticksTotal){
                            var x_value = - numberSec + i * ticksDelta;
                            for (let b = 0; b < this_copy.thirdOctaveLabels.length; b++)  {
                                dbBandTimeSonogramElement[b] = {
                                    band: this_copy.thirdOctaveLabels[b],
                                    level: this_copy.dbBand[b].level
                                }
                            }
                            dbBandTimeSonogram[i] = {
                                time: x_value,
                                data: dbBandTimeSonogramElement
                            }
                        }
                    }
                }

                // chart FFT data update
                for (let i = 0; i < this_copy.dbFftTime.length; i++)  {
                    var x_freq =  i*this_copy.freqResolution
                    var y_db;
                    var y_dbA;
                    if (this_copy.dbFftTime[i] > 0) {y_db = this_copy.dbFftTime[i]} else {y_db = 0}
                    if (this_copy.dbAFftTime[i] > 0) {y_dbA = this_copy.dbAFftTime[i]} else {y_dbA = 0}
                    if (i<2) {x_freq = 10; y_db = 0, y_dbA = 0}
                    dbFftChart[i] = {
                                     x: x_freq,
                                     y: y_db
                                     };
                    dbAFftChart[i] = {
                                      x: x_freq,
                                      y: y_dbA
                                      };
                }

                // charts creation
                if (document.getElementById('chartSimple_card') != null) {
                  if (cSimpleStatus == 0) {
                      cSimple = new chartSimple(dbATime.toFixed(1), this_copy.dbATimeStartMin.toFixed(1), this_copy.dbATimeStartMax.toFixed(1));
                      document.getElementById('chartSimple_card').style.display = 'inline';
                      cSimpleStatus = 1;
                  }

                }

                if (document.getElementById('char') != null) {

                    if (document.getElementById('chartLAeqRunning') != null) {
                        if (cLAeqRunningStatus == 0) {
                            cLAeqRunning = new chartLAeqRunning(dbATimeChart,dbARunningChart,this_copy.translation,this_copy.range);
                            document.getElementById('chartLAeqRunning_card1').style.display = 'inline';
                            cLAeqRunningStatus = 1;
                        }
                    }

                    if (document.getElementById('chartThirdOctaves') != null) {
                        if (cThirdOctavesStatus == 0) {
                            cThirdOctaves = new chartThirdOctaves(this_copy.dbBand,this_copy.translation,this_copy.range);
                            document.getElementById('chartThirdOctaves_card1').style.display = 'none';
                            cThirdOctavesStatus = 1;
                        }
                    }
                    if (document.getElementById('chartSonogram') != null) {
                        if (cSonogramStatus == 0) {
                            cSonogram = new chartSonogram(dbBandTimeSonogram,this_copy.translation);
                            document.getElementById('chartSonogram_card1').style.display = 'none';
                            cSonogramStatus = 1;
                        }
                    }
                    if (document.getElementById('chartFFT') != null) {
                        if (cFftStatus == 0) {
                            cFft = new chartFFT(dbFftChart,dbAFftChart,this_copy.translation,this_copy.range);
                            document.getElementById('chartFFT_card1').style.display = 'none';
                            cFftStatus = 1;
                        }
                    }
                }


                // charts update
                if (this_copy.styleSimple == true) {
                  cSimple.update(dbATime.toFixed(1), this_copy.dbATimeStartMin.toFixed(1), this_copy.dbATimeStartMax.toFixed(1));
                }

                if (this_copy.chartToView == "LAeqRunning"){
                    if (document.getElementById('chartLAeqRunning') != null) {
                        cLAeqRunning.update(dbATimeChart,dbARunningChart,this_copy.range);
                    }
                }
                if (this_copy.chartToView == "ThirdOctaves"){
                    if (document.getElementById('chartThirdOctaves') != null) {
                        cThirdOctaves.update(this_copy.dbBand,this_copy.range);
                    }
                }
                if (this_copy.chartToView == "Sonogram") {
                    if (document.getElementById('chartSonogram') != null) {
                        cSonogram.update(dbBandTimeSonogram);
                    }
                }
                if (this_copy.chartToView == "FFT") {
                    if (document.getElementById('chartFFT') != null) {
                        cFft.update(dbFftChart,dbAFftChart,this_copy.range);
                    }
                }


            }, time);


        }) // end platform ready

        var this_copy = this;

        function createFile() {
            // all available directories
            // console.log("applicationDirectory: " + file.applicationDirectory) // Ipad non crea dir
            // console.log("applicationStorageDirectory: " + file.applicationStorageDirectory) // Ipad non crea dir
            // console.log("cacheDirectory: " + file.cacheDirectory) // Ipad crea dir
            // console.log("dataDirectory: " + file.dataDirectory)  // Ipad crea dir
            // console.log("externalRootDirectory: " + file.externalRootDirectory) // ipad null
            // console.log("externalApplicationStorageDirectory: " + file.externalApplicationStorageDirectory) // ipad null
            // console.log("externalCacheDirectory: " + file.externalCacheDirectory) // ipad null
            // console.log("externalDataDirectory: " + file.externalDataDirectory) // ipad null
            // console.log("documentsDirectory: " + file.documentsDirectory)  // Ipad crea dir
            // console.log("syncedDataDirectory: " + file.syncedDataDirectory) // Ipad crea dir
            // console.log("tempDirectory: " + file.tempDirectory) // Ipad crea dir

            // saving data
            var d = new Date;
            if (document.getElementById('save_label') != null) {
              document.getElementById('save_label').style.fontSize = "small";
            }

            this_copy.home_save_label = this_copy.translation.START + ": " + moment(d).format('ddd MM/DD/YYYY HH:mm:ss');

            this_copy.fileName =  d.getFullYear() + '-' +
                            (d.getMonth()+1).toLocaleString(undefined, {minimumIntegerDigits: 2}) + '-' +
                            d.getDate().toLocaleString(undefined, {minimumIntegerDigits: 2}) + '_' +
                            d.getHours().toLocaleString(undefined, {minimumIntegerDigits: 2}) +
                            d.getMinutes().toLocaleString(undefined, {minimumIntegerDigits: 2}) +
                            d.getSeconds().toLocaleString(undefined, {minimumIntegerDigits: 2}) +
                            '.txt';
            var fileName = this_copy.fileName;
            var dirPathRoot;
            if (this_copy.platform.is('android')) {
                dirPathRoot = file.externalRootDirectory; // android
                }
            if (this_copy.platform.is('ios')) {
                dirPathRoot = file.documentsDirectory; // apple
                }
            var dirName = 'openoise/';
            this_copy.dirPath = dirPathRoot + dirName;
            var storageSettings:any = { dirPathRoot: dirPathRoot,
                                        dirName: dirName,
                                        dirPath: this_copy.dirPath,
                                        fileName: this_copy.fileName}
            appPreferences.store("storageSettings", storageSettings);

            var replace = false;

            var firstLine = 'Date Time LAeq';
            for (let i = 0; i < this_copy.thirdOctaveLabels.length; i++)  {
                firstLine = firstLine + ' ' + this_copy.thirdOctaveLabels[i]
            }
            firstLine = firstLine + '\n'


            file.checkDir(dirPathRoot, dirName)
                    .then(_ => {console.log('Directory ' + dirName + ' already exist')
                                file.createFile(dirPathRoot + dirName, fileName, replace)
                                        .then(_ =>{console.log('File ' + fileName + ' created')
                                                   file.writeExistingFile(dirPathRoot + dirName, fileName, firstLine)
                                                            .then(_ => {console.log('Written first line');
                                                                        console.log(dirPathRoot + dirName + fileName)
                                                                        this_copy.fileCreated = true})
                                                            .catch(err => console.log(err));
                                                    })
                                        .catch(err => console.log('File not created'));
                                })
                    .catch(err  => {console.log('Creating directory: ' + dirName)
                                    file.createDir(dirPathRoot, dirName, replace)
                                            .then(_ => {
                                                        console.log('Directory ' + dirName + ' created')
                                                        file.createFile(dirPathRoot + dirName, fileName, replace)
                                                                .then(_ => {console.log('File ' + fileName + ' created')
                                                                            file.writeExistingFile(dirPathRoot + dirName, fileName, firstLine)
                                                                                .then(_ => {console.log('Written first line');
                                                                                            console.log(dirPathRoot + dirName + fileName)
                                                                                            this_copy.fileCreated = true})
                                                                                .catch(err => console.log(err));
                                                                            })
                                                                .catch(err => console.log('File not created'));
                                                    })
                                            .catch(err => console.log('Directory not created'))
                                    });
        }

        function writeFile(dirPath,fileName,text) {
            file.writeFile(dirPath, fileName, text, {append: true, replace: false})
                    .then(_ => console.log('File written with success'))
                    .catch(err => console.log('Error in writing file'))

        }



        function orientation(){

            // console.log('orientation',this_copy.screenOrientation.type)
            if (this_copy.screenOrientation.type == "portrait-primary") {
                this_copy.screenOrientation.lock(this_copy.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
            } else {
                    this_copy.screenOrientation.lock(this_copy.screenOrientation.ORIENTATIONS.PORTRAIT_SECONDARY);
            }

        }
    } // end constructor

    reset(){
        this.linearARunning = 0;
        this.dbATimeStartMin = 0;
        this.dbATimeStartMax = 0;
        this.numberFftTotal = 0;
        for (let i = 0; i < this.thirdOctaveLabels.length; i++)  {
            this.dbBand[i].level = 0
            this.dbBand[i].min = 0
            this.dbBand[i].max = 0
            this.dbBand[i].running = 0
            this.linearBandRunning[i] = 0
        }

        this.firstGoodValueGlobal = 0
        for (let i = 0; i < this.firstGoodValueBand.length; i++)  {
            this.firstGoodValueBand[i] = 0
        }
        this.date_start = new Date();

        if (this.languageValue == "English") {
            this.home_timeStart = moment().locale('en').format('ddd YYYY/MM/DD HH:mm:ss');// + '.' + mm.toLocaleString(undefined, {minimumIntegerDigits: 3});
        }
        if (this.languageValue == "Italiano") {
            this.home_timeStart = moment().locale('it').format('ddd DD/MM/YYYY HH:mm:ss');// + '.' + mm.toLocaleString(undefined, {minimumIntegerDigits: 3});
        }

        var button = document.getElementById('card_reset')
        var backgroundColor = window.getComputedStyle(button,null).getPropertyValue("background-color");
        var textColor = window.getComputedStyle(button,null).getPropertyValue("color");

        button.style.background = textColor;
        button.style.color = backgroundColor;
        window.setTimeout(function(){
          button.style.background = backgroundColor;
          button.style.color = textColor;
        }, 100);

    }

    chartToViewLAeqRunning(){
        if (this.chartToView != "LAeqRunning") {
          this.chartToView = "LAeqRunning";
          document.getElementById('chartLAeqRunning_card1').style.display = 'inline';
          document.getElementById('chartThirdOctaves_card1').style.display = 'none';
          document.getElementById('chartSonogram_card1').style.display = 'none';
          document.getElementById('chartFFT_card1').style.display = 'none';
          var chartButtonLAeq = document.getElementById('chartButtonLAeq')
          var chartButtonOctaves = document.getElementById('chartButtonOctaves')
          var chartButtonSonogram = document.getElementById('chartButtonSonogram')
          var chartButtonFFT = document.getElementById('chartButtonFFT')
          var backgroundColor = window.getComputedStyle(chartButtonLAeq,null).getPropertyValue("background-color");
          var textColor = window.getComputedStyle(chartButtonLAeq,null).getPropertyValue("color");
          chartButtonLAeq.style.background = textColor;
          chartButtonLAeq.style.color = backgroundColor;

          chartButtonOctaves.style.background = backgroundColor;
          chartButtonOctaves.style.color = textColor;
          chartButtonSonogram.style.background = backgroundColor;
          chartButtonSonogram.style.color = textColor;
          chartButtonFFT.style.background = backgroundColor;
          chartButtonFFT.style.color = textColor;
        }

    }
    chartToViewThirdOctaves(){
        if (this.chartToView != "ThirdOctaves") {
          this.chartToView = "ThirdOctaves";
          document.getElementById('chartLAeqRunning_card1').style.display = 'none';
          document.getElementById('chartThirdOctaves_card1').style.display = 'inline';
          document.getElementById('chartSonogram_card1').style.display = 'none';
          document.getElementById('chartFFT_card1').style.display = 'none';
          var chartButtonLAeq = document.getElementById('chartButtonLAeq')
          var chartButtonOctaves = document.getElementById('chartButtonOctaves')
          var chartButtonSonogram = document.getElementById('chartButtonSonogram')
          var chartButtonFFT = document.getElementById('chartButtonFFT')
          var backgroundColor = window.getComputedStyle(chartButtonOctaves,null).getPropertyValue("background-color");
          var textColor = window.getComputedStyle(chartButtonOctaves,null).getPropertyValue("color");
          chartButtonOctaves.style.background = textColor;
          chartButtonOctaves.style.color = backgroundColor;

          chartButtonLAeq.style.background = backgroundColor;
          chartButtonLAeq.style.color = textColor;
          chartButtonSonogram.style.background = backgroundColor;
          chartButtonSonogram.style.color = textColor;
          chartButtonFFT.style.background = backgroundColor;
          chartButtonFFT.style.color = textColor;
        }
    }
    chartToViewSonogram(){
        if (this.chartToView !="Sonogram") {
          this.chartToView = "Sonogram";
          document.getElementById('chartLAeqRunning_card1').style.display = 'none';
          document.getElementById('chartThirdOctaves_card1').style.display = 'none';
          document.getElementById('chartSonogram_card1').style.display = 'inline';
          document.getElementById('chartFFT_card1').style.display = 'none';
          var chartButtonLAeq = document.getElementById('chartButtonLAeq')
          var chartButtonOctaves = document.getElementById('chartButtonOctaves')
          var chartButtonSonogram = document.getElementById('chartButtonSonogram')
          var chartButtonFFT = document.getElementById('chartButtonFFT')
          var backgroundColor = window.getComputedStyle(chartButtonSonogram,null).getPropertyValue("background-color");
          var textColor = window.getComputedStyle(chartButtonSonogram,null).getPropertyValue("color");
          chartButtonSonogram.style.background = textColor;
          chartButtonSonogram.style.color = backgroundColor;

          chartButtonLAeq.style.background = backgroundColor;
          chartButtonLAeq.style.color = textColor;
          chartButtonOctaves.style.background = backgroundColor;
          chartButtonOctaves.style.color = textColor;
          chartButtonFFT.style.background = backgroundColor;
          chartButtonFFT.style.color = textColor;
        }
    }
    chartToViewFFT(){
        if (this.chartToView != "FFT") {
          this.chartToView = "FFT";
          document.getElementById('chartLAeqRunning_card1').style.display = 'none';
          document.getElementById('chartThirdOctaves_card1').style.display = 'none';
          document.getElementById('chartSonogram_card1').style.display = 'none';
          document.getElementById('chartFFT_card1').style.display = 'inline';
          var chartButtonLAeq = document.getElementById('chartButtonLAeq')
          var chartButtonOctaves = document.getElementById('chartButtonOctaves')
          var chartButtonSonogram = document.getElementById('chartButtonSonogram')
          var chartButtonFFT = document.getElementById('chartButtonFFT')
          var backgroundColor = window.getComputedStyle(chartButtonFFT,null).getPropertyValue("background-color");
          var textColor = window.getComputedStyle(chartButtonFFT,null).getPropertyValue("color");
          chartButtonFFT.style.background = textColor;
          chartButtonFFT.style.color = backgroundColor;

          chartButtonLAeq.style.background = backgroundColor;
          chartButtonLAeq.style.color = textColor;
          chartButtonOctaves.style.background = backgroundColor;
          chartButtonOctaves.style.color = textColor;
          chartButtonSonogram.style.background = backgroundColor;
          chartButtonSonogram.style.color = textColor;
        }
    }

    rotate(){
        if (this.screenOrientation.type=="portrait-primary"){
            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_SECONDARY);
        } else {
            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
        }
    }

    exit(){
        this.platform.exitApp();
    }




    savedFileAlert(): void {
      if (this.save == false) {
        let alert = this.alertCtrl.create({
          title: this.translation.SAVED_DATA + ":",
          subTitle: this.fileName,
          buttons: ['OK'],
          cssClass: "alert"
        });
        alert.present();
      }
    }

    saveNew() {
      if (this.save == false) {
        document.getElementById('save_icon').style.color = "red"
        this.reset()
        this.save = true

        console.log(this.translation.SAVE_START)

        // let toast = this.toastCtrl.create({
        //   message: this.translation.SAVE_START,
        //   position: 'middle',
        //   duration: 1500
        // });
        // toast.present();
        let alert = this.alertCtrl.create({
          // title: this.translation.SAVE_START + ":",
          subTitle: this.translation.SAVE_START,
          cssClass: "alert"
        });
        alert.present();

        setTimeout(function(){ alert.dismiss(); }, 1000);

      } else {
        var LAeqt = document.getElementById('LAeqt')
        var textColor = window.getComputedStyle(LAeqt,null).getPropertyValue("color");
        document.getElementById('save_icon').style.color = textColor
        this.save = false
        this.savedFileAlert()
      }

    }


    // first it's read the constructor, then:
    // // 1
    // ionViewDidLoad() {
    //      console.log('home ionViewDidLoad')
    // }

    // // 2
    ionViewWillEnter() {
          // console.log('home ionViewWillEnter')
          // back button to exit
          this.platform.registerBackButtonAction(() => {
                  this.platform.exitApp();
                },1)
      }

    // // 3
    ionViewDidEnter() {
           console.log('home ionViewDidEnter')



           // button LAeq color
           window.setTimeout(function(){
                   var chartButtonLAeq = document.getElementById('chartButtonLAeq')
                   // console.log(chartButtonLAeq)
                   var backgroundColor = window.getComputedStyle(chartButtonLAeq,null).getPropertyValue("background-color");
                   var textColor = window.getComputedStyle(chartButtonLAeq,null).getPropertyValue("color");
                   chartButtonLAeq.style.background = textColor;
                   chartButtonLAeq.style.color = backgroundColor

           }, 200);

        }

    // here the platform is ready (this is the behaviour of the first run), then
    // 4
    ionViewCanLeave() {
        // console.log('home ionViewCanLeave')
        audioinput.stop();
        window.removeEventListener( "audioinput", this.onAudio, false );
        clearInterval(this.refreshView);
    }

    // // 5
    // ionViewWillLeave() {
    //      console.log('home ionViewWillLeave')
    //   }
    //
    // // 6
    // ionViewDidLeave() {
    //      console.log('home ionViewDidLeave')
    //   }
    //
    // // 7
    // ionViewWillUnload() {
    //      console.log('home ionViewWillUnload')
    // }
}
