export function precalculateWeightedA(bufferFFT, freqResolution ) {
    
    var weightedA:Array<number> = [];

    for (let i = 0; i < bufferFFT; i++) {
        var actualFreq:number = freqResolution * i;
        var actualFreqSQ:number = actualFreq * actualFreq;
        var actualFreqFour:number = actualFreqSQ * actualFreqSQ;
        var actualFreqEight:number = actualFreqFour * actualFreqFour;

        var t1:number = 20.598997 * 20.598997 + actualFreqSQ;
        t1 = t1 * t1;
        var t2:number= 107.65265 * 107.65265 + actualFreqSQ;
        var t3:number = 737.86223 * 737.86223 + actualFreqSQ;
        var t4:number = 12194.217 * 12194.217 + actualFreqSQ;
        t4 = t4 * t4;

        weightedA[i] = 10 * Math.log10((3.5041384e16 * actualFreqEight) / (t1 * t2 * t3 * t4));
    }
    return weightedA
}