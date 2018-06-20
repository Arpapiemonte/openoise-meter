import { precalculateWeightedA } from './precalculateWeightedA';

export class onBandCalc {

    public linearFftGlobal: number = 0;
    public linearAFftGlobal: number = 0;
    public linearBandFft:Array<number> = [];
    public dbFft:Array<number> = [];
    public dbAFft:Array<number> = [];
    public linearFft:Array<number> = [];
    public linearAFft:Array<number> = [];

    constructor(p_ref,linearGain,thirdOctave,bufferFFT,freqResolution,mag){

        // A weight (array with FFT output dimension)
        var weightedA = precalculateWeightedA(bufferFFT,freqResolution)

        // var dbFft:Array<number> = [];
        var linearFft:Array<number> = [];
        // var linearFftGlobal:number = 0;

        // var dbAFft:Array<number> = [];
        // var linearAFft:Array<number> = [];
        // var linearAFftGlobal:number = 0;


        var linearBandFftCount:Array<number> = [];
        // var linearBandFft:Array<number> = [];

        for (let i = 0; i < thirdOctave.length; i++)  {
            linearBandFftCount[i] = 0;
            this.linearBandFft[i] = 0;
        }

        for (let i = 0; i < mag.length; i++)  {
            // linear value for FFT band with gain
            linearFft[i] = (mag[i] * mag[i] / (p_ref * p_ref)) * linearGain;

            // db and dbA level for FFT band
            this.dbFft[i] = 10 * Math.log10(linearFft[i]);
            this.dbAFft[i] = this.dbFft[i] + weightedA[i];
            
            this.linearFft[i] = linearFft[i]
            this.linearAFft[i] = Math.pow(10, this.dbAFft[i] / 10)

            // Global level linear and A for buffer FFT
            this.linearFftGlobal +=  linearFft[i];
            this.linearAFftGlobal +=  Math.pow(10, this.dbAFft[i] / 10);

            // console.log(i * freqResolution)
            if ((0 <= i * freqResolution) && (i * freqResolution < 17.8)) {
                linearBandFftCount[0] += 1;
                this.linearBandFft[0] += linearFft[i];
            }
            if ((17.8 <= i * freqResolution) && (i * freqResolution < 22.4)) {
                linearBandFftCount[1] += 1;
                this.linearBandFft[1] += linearFft[i];
            }
            if ((22.4 <= i * freqResolution) && (i * freqResolution < 28.2)) {
                linearBandFftCount[2] += 1;
                this.linearBandFft[2] += linearFft[i];
            }
            if ((28.2 <= i * freqResolution) && (i * freqResolution < 35.5)) {
                linearBandFftCount[3] += 1;
                this.linearBandFft[3] += linearFft[i];
            }
            if ((35.5 <= i * freqResolution) && (i * freqResolution < 44.7)) {
                linearBandFftCount[4] += 1;
                this.linearBandFft[4] += linearFft[i];
            }
            if ((44.7 <= i * freqResolution) && (i * freqResolution < 56.2)) {
                linearBandFftCount[5] += 1;
                this.linearBandFft[5] += linearFft[i];
            }
            if ((56.2 <= i * freqResolution) && (i * freqResolution < 70.8)) {
                linearBandFftCount[6] += 1;
                this.linearBandFft[6] += linearFft[i];
            }
            if ((70.8 <= i * freqResolution) && (i * freqResolution < 89.1)) {
                linearBandFftCount[7] += 1;
                this.linearBandFft[7] += linearFft[i];
            }
            if ((89.1 <= i * freqResolution) && (i * freqResolution < 112)) {
                linearBandFftCount[8] += 1;
                this.linearBandFft[8] += linearFft[i];
            }
            if ((112 <= i * freqResolution) && (i * freqResolution < 141)) {
                linearBandFftCount[9] += 1;
                this.linearBandFft[9] += linearFft[i];
            }
            if ((141 <= i * freqResolution) && (i * freqResolution < 178)) {
                linearBandFftCount[10] += 1;
                this.linearBandFft[10] += linearFft[i];
            }
            if ((178 <= i * freqResolution) && (i * freqResolution < 224)) {
                linearBandFftCount[11] += 1;
                this.linearBandFft[11] += linearFft[i];
            }
            if ((224 <= i * freqResolution) && (i * freqResolution < 282)) {
                linearBandFftCount[12] += 1;
                this.linearBandFft[12] += linearFft[i];
            }
            if ((282 <= i * freqResolution) && (i * freqResolution < 355)) {
                linearBandFftCount[13] += 1;
                this.linearBandFft[13] += linearFft[i];
            }
            if ((355 <= i * freqResolution) && (i * freqResolution < 447)) {
                linearBandFftCount[14] += 1;
                this.linearBandFft[14] += linearFft[i];
            }
            if ((447 <= i * freqResolution) && (i * freqResolution < 562)) {
                linearBandFftCount[15] += 1;
                this.linearBandFft[15] += linearFft[i];
            }
            if ((562 <= i * freqResolution) && (i * freqResolution < 708)) {
                linearBandFftCount[16] += 1;
                this.linearBandFft[16] += linearFft[i];
            }
            if ((708 <= i * freqResolution) && (i * freqResolution < 891)) {
                linearBandFftCount[17] += 1;
                this.linearBandFft[17] += linearFft[i];
            }
            if ((891 <= i * freqResolution) && (i * freqResolution < 1122)) {
                linearBandFftCount[18] += 1;
                this.linearBandFft[18] += linearFft[i];
            }
            if ((1122 <= i * freqResolution) && (i * freqResolution < 1413)) {
                linearBandFftCount[19] += 1;
                this.linearBandFft[19] += linearFft[i];
            }
            if ((1413 <= i * freqResolution) && (i * freqResolution < 1778)) {
                linearBandFftCount[20] += 1;
                this.linearBandFft[20] += linearFft[i];
            }
            if ((1778 <= i * freqResolution) && (i * freqResolution < 2239)) {
                linearBandFftCount[21] += 1;
                this.linearBandFft[21] += linearFft[i];
            }
            if ((2239 <= i * freqResolution) && (i * freqResolution < 2818)) {
                linearBandFftCount[22] += 1;
                this.linearBandFft[22] += linearFft[i];
            }
            if ((2818 <= i * freqResolution) && (i * freqResolution < 3548)) {
                linearBandFftCount[23] += 1;
                this.linearBandFft[23] += linearFft[i];
            }
            if ((3548 <= i * freqResolution) && (i * freqResolution < 4467)) {
                linearBandFftCount[24] += 1;
                this.linearBandFft[24] += linearFft[i];
            }
            if ((4467 <= i * freqResolution) && (i * freqResolution < 5623)) {
                linearBandFftCount[25] += 1;
                this.linearBandFft[25] += linearFft[i];
            }
            if ((5623 <= i * freqResolution) && (i * freqResolution < 7079)) {
                linearBandFftCount[26] += 1;
                this.linearBandFft[26] += linearFft[i];
            }
            if ((7079 <= i * freqResolution) && (i * freqResolution < 8913)) {
                linearBandFftCount[27] += 1;
                this.linearBandFft[27] += linearFft[i];
            }
            if ((8913 <= i * freqResolution) && (i * freqResolution < 11220)) {
                linearBandFftCount[28] += 1;
                this.linearBandFft[28] += linearFft[i];
            }
            if ((11220 <= i * freqResolution) && (i * freqResolution < 14130)) {
                linearBandFftCount[29] += 1;
                this.linearBandFft[29] += linearFft[i];
            }
            if ((14130 <= i * freqResolution) && (i * freqResolution < 17780)) {
                linearBandFftCount[30] += 1;
                this.linearBandFft[30] += linearFft[i];
            }
            if ((17780 <= i * freqResolution) && (i * freqResolution < 22390)) {
                linearBandFftCount[31] += 1;
                this.linearBandFft[31] += linearFft[i];
            }

        } // end for on FFT lines

    }

}
