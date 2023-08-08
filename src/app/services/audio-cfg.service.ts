import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { VariabiliService } from './variabili.service';

declare var audioinput: any;

@Injectable({
  providedIn: 'root'
})
export class AudioCfgService {

  freqResolution: number;
  bufferFFT: number;
  captureCfg: any;

  samplerate: number = 44100;
  bufferFFT_all_platform: number = 8192;
  // sourceType: any;

  actualFreqMin = 0
  actualFreqMax = 22390

  constructor(
    public platform: Platform,
    public variabiliService: VariabiliService,
  ) {
    // get normalized magnitudes for frequencies from 0 to 22050 with interval 
    // bufferFFT 2048 (0.046 s), freqResolution 22050/1024 ≈ 21.5Hz
    // bufferFFT 4096 (0.093 s), freqResolution 22050/2048 ≈ 10.8Hz
    // *** bufferFFT 8192 (0.186 s), freqResolution 22050/4096 ≈ 5.4Hz *** NOSTRO CASO ***

    // VARIABLE-FIXED
    // samplerate

    if (this.platform.is('android')) {
      console.log("running on Android device!");
      this.bufferFFT = this.bufferFFT_all_platform;
      this.freqResolution = this.samplerate / (this.bufferFFT);
      // this.sourceType = audioinput.AUDIOSOURCE_TYPE.VOICE_RECOGNITION;
    }
    if (this.platform.is('ios')) {
      console.log("running on iOS device!");
      // buffer FFT *** there's a factor 2 android / ios ***
      this.bufferFFT = this.bufferFFT_all_platform * 2;
      // freqResolution *** there's a factor 2 android / ios ***
      this.freqResolution = this.samplerate / (this.bufferFFT / 2);
      // this.sourceType = audioinput.AUDIOSOURCE_TYPE.UNPROCESSED;
    }

    // console.log('samplerate ' + samplerate + ' bufferFFT ' + this.bufferFFT  + ' freq res ' + this.freqResolution)

  }

  config() {
    var captureCfg = {

      // The Sample Rate in Hz. 
      // For convenience, use the audioinput.SAMPLERATE constants to set this parameter. 
      sampleRate: this.samplerate,//audioinput.SAMPLERATE.CD_AUDIO_44100Hz,

      // Maximum size in bytes of the capture buffer. 
      bufferSize: this.bufferFFT,//16384,

      // The number of channels to use: Mono (1) or Stereo (2). 
      // For convenience, use the audioinput.CHANNELS constants to set this parameter. 
      channels: audioinput.CHANNELS.MONO,

      // The audio format. Currently PCM_16BIT and PCM_8BIT are supported. 
      // For convenience, use the audioinput.FORMAT constant to access the possible  
      // formats this the plugin supports. 
      format: audioinput.FORMAT.PCM_16BIT,

      // Specifies if the audio data should be normalized or not. 
      normalize: false,

      // Specifies the factor to use if normalization is performed. 
      normalizationFactor: 32767.0,

      // If set to true, the plugin will handle all conversion of the data to  
      // web audio. The plugin can then act as an AudioNode this can be connected  
      // to your web audio node chain. 
      streamToWebAudio: false,

      // Used in conjunction with streamToWebAudio. If no audioContext is given,  
      // one (prefixed) will be created by the plugin. 
      audioContext: null,

      // Defines how many chunks will be merged each time, a low value means lower latency 
      // but requires more CPU resources. 
      concatenateMaxChunks: 10,

      // Specifies the type of the type of source audio your app requires. 
      // For convenience, use the audioinput.AUDIOSOURCE_TYPE constants to set this parameter: 
      // -DEFAULT 
      // -CAMCORDER - Microphone audio source with same orientation as camera if available. 
      // -UNPROCESSED - Unprocessed sound if available. 
      // -VOICE_COMMUNICATION - Tuned for voice communications such as VoIP. 
      // -MIC - Microphone audio source. (Android only) 
      // -VOICE_RECOGNITION - Tuned for voice recognition if available (Android only) 
      // audioSourceType: this.sourceType
      audioSourceType: audioinput.AUDIOSOURCE_TYPE.UNPROCESSED

    };

    return captureCfg
  }

  onBandCalc(p_ref: number, linearGain: number, thirdOctave: any, mag: any) {

    // variabile di test: ricordarsi di commentare il test altrimenti rallenta l'esecuzione della misura
    // var calcTest = []

    var linearFftGlobal = 0;
    var linearAFftGlobal = 0;
    var linearBandFft = [];
    var dbFft = [];
    var dbAFft = [];
    var linearFft = [];
    var linearAFft = [];
    var linearBandFftCount: Array<number> = [];

    // A weight (array with FFT output dimension)
    var weightedA = this.precalculateWeightedA()

    for (let i = 0; i < thirdOctave.length; i++) {
      linearBandFftCount[i] = 0;
      linearBandFft[i] = 0;
    }

    for (let i = 0; i < mag.length; i++) {
      // freq value
      let actualFreq = i * this.freqResolution + this.freqResolution

      // linear adn db value for FFT band with gain
      linearFft[i] = (mag[i] * mag[i] / (p_ref * p_ref)) * linearGain;
      dbFft[i] = 10 * Math.log10(linearFft[i]);

      // A weigth
      dbAFft[i] = dbFft[i] + weightedA[i];
      linearAFft[i] = Math.pow(10, dbAFft[i] / 10)

      // taglio a frequenze impostate dall'utente
      if (actualFreq < this.actualFreqMin) {
        linearFft[i] = 0
        dbFft[i] = 0
        dbAFft[i] = 0
        linearAFft[i] = 0
      }

      if (actualFreq > this.actualFreqMax) {
        linearFft[i] = 0
        dbFft[i] = 0
        dbAFft[i] = 0
        linearAFft[i] = 0
      }

      // Global level linear and A for buffer FFT
      linearFftGlobal += linearFft[i]
      linearAFftGlobal += linearAFft[i]

      // calcTest.push({
      //   i: i,
      //   freq: actualFreq,
      //   dbFft: dbFft[i],
      //   dbAFft: dbAFft[i],
      //   weightedA: weightedA[i]
      // })

      // console.log(actualFreq)

      if ((14.1 <= actualFreq) && (actualFreq < 17.8)) {
        linearBandFftCount[0] += 1;
        linearBandFft[0] += linearFft[i];
      }
      if ((17.8 <= actualFreq) && (actualFreq < 22.4)) {
        linearBandFftCount[1] += 1;
        linearBandFft[1] += linearFft[i];
      }
      if ((22.4 <= actualFreq) && (actualFreq < 28.2)) {
        linearBandFftCount[2] += 1;
        linearBandFft[2] += linearFft[i];
      }
      if ((28.2 <= actualFreq) && (actualFreq < 35.5)) {
        linearBandFftCount[3] += 1;
        linearBandFft[3] += linearFft[i];
      }
      if ((35.5 <= actualFreq) && (actualFreq < 44.7)) {
        linearBandFftCount[4] += 1;
        linearBandFft[4] += linearFft[i];
      }
      if ((44.7 <= actualFreq) && (actualFreq < 56.2)) {
        linearBandFftCount[5] += 1;
        linearBandFft[5] += linearFft[i];
      }
      if ((56.2 <= actualFreq) && (actualFreq < 70.8)) {
        linearBandFftCount[6] += 1;
        linearBandFft[6] += linearFft[i];
      }
      if ((70.8 <= actualFreq) && (actualFreq < 89.1)) {
        linearBandFftCount[7] += 1;
        linearBandFft[7] += linearFft[i];
      }
      if ((89.1 <= actualFreq) && (actualFreq < 112)) {
        linearBandFftCount[8] += 1;
        linearBandFft[8] += linearFft[i];
      }
      if ((112 <= actualFreq) && (actualFreq < 141)) {
        linearBandFftCount[9] += 1;
        linearBandFft[9] += linearFft[i];
      }
      if ((141 <= actualFreq) && (actualFreq < 178)) {
        linearBandFftCount[10] += 1;
        linearBandFft[10] += linearFft[i];
      }
      if ((178 <= actualFreq) && (actualFreq < 224)) {
        linearBandFftCount[11] += 1;
        linearBandFft[11] += linearFft[i];
      }
      if ((224 <= actualFreq) && (actualFreq < 282)) {
        linearBandFftCount[12] += 1;
        linearBandFft[12] += linearFft[i];
      }
      if ((282 <= actualFreq) && (actualFreq < 355)) {
        linearBandFftCount[13] += 1;
        linearBandFft[13] += linearFft[i];
      }
      if ((355 <= actualFreq) && (actualFreq < 447)) {
        linearBandFftCount[14] += 1;
        linearBandFft[14] += linearFft[i];
      }
      if ((447 <= actualFreq) && (actualFreq < 562)) {
        linearBandFftCount[15] += 1;
        linearBandFft[15] += linearFft[i];
      }
      if ((562 <= actualFreq) && (actualFreq < 708)) {
        linearBandFftCount[16] += 1;
        linearBandFft[16] += linearFft[i];
      }
      if ((708 <= actualFreq) && (actualFreq < 891)) {
        linearBandFftCount[17] += 1;
        linearBandFft[17] += linearFft[i];
      }
      if ((891 <= actualFreq) && (actualFreq < 1122)) {
        linearBandFftCount[18] += 1;
        linearBandFft[18] += linearFft[i];
      }
      if ((1122 <= actualFreq) && (actualFreq < 1413)) {
        linearBandFftCount[19] += 1;
        linearBandFft[19] += linearFft[i];
      }
      if ((1413 <= actualFreq) && (actualFreq < 1778)) {
        linearBandFftCount[20] += 1;
        linearBandFft[20] += linearFft[i];
      }
      if ((1778 <= actualFreq) && (actualFreq < 2239)) {
        linearBandFftCount[21] += 1;
        linearBandFft[21] += linearFft[i];
      }
      if ((2239 <= actualFreq) && (actualFreq < 2818)) {
        linearBandFftCount[22] += 1;
        linearBandFft[22] += linearFft[i];
      }
      if ((2818 <= actualFreq) && (actualFreq < 3548)) {
        linearBandFftCount[23] += 1;
        linearBandFft[23] += linearFft[i];
      }
      if ((3548 <= actualFreq) && (actualFreq < 4467)) {
        linearBandFftCount[24] += 1;
        linearBandFft[24] += linearFft[i];
      }
      if ((4467 <= actualFreq) && (actualFreq < 5623)) {
        linearBandFftCount[25] += 1;
        linearBandFft[25] += linearFft[i];
      }
      if ((5623 <= actualFreq) && (actualFreq < 7079)) {
        linearBandFftCount[26] += 1;
        linearBandFft[26] += linearFft[i];
      }
      if ((7079 <= actualFreq) && (actualFreq < 8913)) {
        linearBandFftCount[27] += 1;
        linearBandFft[27] += linearFft[i];
      }
      if ((8913 <= actualFreq) && (actualFreq < 11220)) {
        linearBandFftCount[28] += 1;
        linearBandFft[28] += linearFft[i];
      }
      if ((11220 <= actualFreq) && (actualFreq < 14130)) {
        linearBandFftCount[29] += 1;
        linearBandFft[29] += linearFft[i];
      }
      if ((14130 <= actualFreq) && (actualFreq < 17780)) {
        linearBandFftCount[30] += 1;
        linearBandFft[30] += linearFft[i];
      }
      if ((17780 <= actualFreq) && (actualFreq < 22390)) {
        linearBandFftCount[31] += 1;
        linearBandFft[31] += linearFft[i];
      }

    } // end for on FFT lines

    // console.log("calcTest", calcTest)
    // console.log("linearBandFftCount", linearBandFftCount)

    return {
      linearFftGlobal: linearFftGlobal,
      linearAFftGlobal: linearAFftGlobal,
      linearBandFft: linearBandFft,
      dbFft: dbFft,
      dbAFft: dbAFft,
      linearFft: linearFft,
      linearAFft: linearAFft,
    }

  }

  precalculateWeightedA() {

    var weightedA: Array<number> = [];
    // variabile di test: ricordarsi di commentare il test altrimenti rallenta l'esecuzione della misura
    // var weightedATest = [] 

    for (let i = 0; i < this.bufferFFT_all_platform; i++) {
      var actualFreq: number = this.freqResolution * i + this.freqResolution;
      var actualFreqSQ: number = actualFreq * actualFreq;
      var actualFreqFour: number = actualFreqSQ * actualFreqSQ;
      var actualFreqEight: number = actualFreqFour * actualFreqFour;

      var t1: number = 20.598997 * 20.598997 + actualFreqSQ;
      t1 = t1 * t1;
      var t2: number = 107.65265 * 107.65265 + actualFreqSQ;
      var t3: number = 737.86223 * 737.86223 + actualFreqSQ;
      var t4: number = 12194.217 * 12194.217 + actualFreqSQ;
      t4 = t4 * t4;

      weightedA[i] = 10 * Math.log10((3.5041384e16 * actualFreqEight) / (t1 * t2 * t3 * t4));

      // let elTest = {
      //   i: i,
      //   freq: actualFreq,
      //   weightedA: weightedA[i]
      // }
      // weightedATest.push(elTest)
    }
    // console.log("weightedA.length", weightedA.length)
    // console.log("weightedA", weightedA)
    // console.log("weightedATest", weightedATest)
    return weightedA
  }
}
