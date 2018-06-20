import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

// module downloaded
declare var audioinput:any;
import fft from 'fourier-transform/asm';
import { AppPreferences } from '@ionic-native/app-preferences';

import { HomePage } from '../home/home';
import { SettingsPage } from '../settings/settings';

// module written
import { audioCfg } from './../home/audioCfg';
import { onBandCalc } from './../home/onBandCalc';



@Component({
  selector: 'page-calibration',
  templateUrl: 'calibration.html',
})
export class CalibrationPage {

    // elements in the home html
    home_dbATime:string = '0';
    calibration:number = 0;
    gain:string;
    prova:string = 'ciao';

    // VARIABLES
    linearARunning:number = 0;
    numberFftTotal:number = 0;
    refreshView:any;
    onAudio:any;

    thirdOctave:Array<number> = [16, 20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500,
        630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000];

    constructor(public navCtrl: NavController, public platform: Platform,
                private appPreferences: AppPreferences
                ) {

        this.navCtrl;

        this.platform.ready().then(() => {

            var this_copy = this;

            // VARIABLES-PREFERENCES
            // gain
            var dbGain:number = 0;
            var linearGain:number = 1;

            this.appPreferences.fetch('calibration').then((res) => {
                if (isNaN(res) || res == null || res == "") {
                    this.appPreferences.store("calibration", "0");
                    this.calibration = 0;
                } else {
                    dbGain = parseFloat(res);
                    linearGain = Math.pow(10, dbGain / 10);
                    this.calibration = dbGain * 10;
                }
                });

            // refresh time (ms)
            var time:number = 1000;
            // pression reference
            var p_ref:number  = 0.00002;

            // set audio capture configuration
            var capture = new audioCfg(this);
            var bufferFFT = capture.bufferFFT;
            var freqResolution = capture.freqResolution;

            // set audio capture configuration
            window.setTimeout(function(){
                                         // console.log('oraprovo calib');
                                         audioinput.start(capture.captureCfg)
                                          }, 500);

            var numberFftTime:number = 0;
            var linearATime:number = 0;

            var linearBandTime:Array<number> = [];


            this.onAudio = function onAudioInput( evt ) {
                // 'evt.data' is an integer array containing raw audio data

                // cause calibration can change, so dbGain had to change
                dbGain = this_copy.calibration/10;
                linearGain = Math.pow(10, dbGain / 10);

                numberFftTime += 1;
                this_copy.numberFftTotal += 1;

                // hanning without overlap
                for (let i = 0; i < evt.data.length; i++)  {

                    var rad: number = (2 * Math.PI * i) / (bufferFFT - 1);
                    var hanning = (1 - Math.cos(rad)) * 0.5;
                    evt.data[i] = evt.data[i] * hanning;

                }

                // remember that fft gets an array of bufferFFT/2 elements
                var mag = fft(evt.data);

                // console.log('calib gain: ' + dbGain)
                // Bands calculation
                var onBandCalcResults = new onBandCalc(p_ref,linearGain,this_copy.thirdOctave,bufferFFT,freqResolution,mag);
                var linearAFftGlobal = onBandCalcResults.linearAFftGlobal;
                var linearBandFft = onBandCalcResults.linearBandFft;


                // Bands levels (db) for FFT
                var dbBandFft:Array<number> = [];
                for (let i = 0; i < linearBandFft.length; i++)  {
                    dbBandFft[i] =  (10 * Math.log10(linearBandFft[i]));
                }

                // linear level (sum - until setInterval reset)
                linearATime += linearAFftGlobal;
                // linear level for Band (sum - until setInterval reset)
                for (let i = 0; i < linearBandFft.length; i++)  {
                    linearBandTime[i] += linearBandFft[i];
                }
                // Linear level running since start (sum)
                this_copy.linearARunning += linearAFftGlobal;


            }  // end onAudioInput

            ///////// part for audioinput
            // Listen to audioinput events
            window.addEventListener( "audioinput", this.onAudio, false );
            // window.addEventListener( "audioinput", refreshData, false );

            var onAudioInputError = function( error ) {
                alert( "onAudioInputError event recieved: " + JSON.stringify(error) );
            };

            // Listen to audioinputerror events
            window.addEventListener( "audioinputerror", onAudioInputError, false );
            ///////// end part for audioinput


            // global variables
            var this_copy = this;
            var dbATime:number = 0;
            var first_loop = 0;

            // refresh view every 'time'
            this.refreshView = setInterval(function(){

                // LAeq in time
                dbATime = 10 * Math.log10(linearATime/numberFftTime);

                linearATime = 0;

                first_loop++;

                this_copy.home_dbATime = (dbATime).toFixed(1);

                numberFftTime = 0;

                this_copy.appPreferences.store("calibration", (this_copy.calibration/10).toFixed(1));


            }, time);


        }) // end platform ready


    } // end constructor

    subtract() {
        if (this.calibration > -300){
            this.calibration = this.calibration - 1;
        }
    }

    add() {
        if (this.calibration < 300){
            this.calibration = this.calibration + 1;
        }
    }

    reset() {

        this.calibration = 0;

    }


    // ionViewWillLeave() {
    //     console.log('calibration ionViewWillLeave')
    //
    //   }
    //
    // ionViewDidLeave() {
    //     console.log('calibration ionViewDidLeave')
    //   }

    ionViewWillEnter() {
        // console.log('calibration ionViewWillEnter')
        // back button to HomePage
        this.platform.registerBackButtonAction(() => {
            this.navCtrl.setRoot(SettingsPage);
            this.navCtrl.popToRoot()
          },1)

      }

    // ionViewDidEnter() {
    //     console.log('calibration ionViewDidEnter')
    //   }
    //
    // ionViewDidLoad() {
    //     console.log('calibration ionViewDidLoad')
    //     }

    ionViewCanLeave() {
        // console.log('calibration ionViewCanLeave')
        audioinput.stop();
        window.removeEventListener( "audioinput", this.onAudio, false );
        clearInterval(this.refreshView);
    }

    // ionViewWillUnload() {
    //     console.log('calibration ionViewWillUnload')
    // }
}
