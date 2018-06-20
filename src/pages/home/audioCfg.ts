declare var audioinput:any;

export class audioCfg {

    public freqResolution: number;
    public bufferFFT: number;
    public captureCfg: any;

    constructor(that){

        // get normalized magnitudes for frequencies from 0 to 22050 with interval 
        // bufferFFT 2048 (0.046 s), freqResolution 22050/1024 ≈ 21.5Hz
        // bufferFFT 4096 (0.093 s), freqResolution 22050/2048 ≈ 10.8Hz
        // *** bufferFFT 8192 (0.186 s), freqResolution 22050/4096 ≈ 5.4Hz *** NOSTRO CASO ***

        // VARIABLE-FIXED
        // samplerate
        var samplerate: number = 44100;
        var bufferFFT_all_platform:number = 8192;
        var sourceType: any;

        if (that.platform.is('android')) {
        console.log("running on Android device!");
        this.bufferFFT = bufferFFT_all_platform;
        this.freqResolution = samplerate / (this.bufferFFT );
        sourceType = audioinput.AUDIOSOURCE_TYPE.VOICE_RECOGNITION;
        }
        if (that.platform.is('ios')) {
        console.log("running on iOS device!");
        // buffer FFT *** there's a factor 2 android / ios ***
        this.bufferFFT  = bufferFFT_all_platform * 2;
        // freqResolution *** there's a factor 2 android / ios ***
        this.freqResolution = samplerate / (this.bufferFFT /2);
        sourceType = audioinput.AUDIOSOURCE_TYPE.UNPROCESSED;
        }

        
        // console.log('samplerate ' + samplerate + ' bufferFFT ' + this.bufferFFT  + ' freq res ' + this.freqResolution)
    
        this.captureCfg  = {
        
            // The Sample Rate in Hz. 
            // For convenience, use the audioinput.SAMPLERATE constants to set this parameter. 
            sampleRate: samplerate,//audioinput.SAMPLERATE.CD_AUDIO_44100Hz,
            
            // Maximum size in bytes of the capture buffer. 
            bufferSize: this.bufferFFT ,//16384,
            
            // The number of channels to use: Mono (1) or Stereo (2). 
            // For convenience, use the audioinput.CHANNELS constants to set this parameter. 
            channels: audioinput.CHANNELS.MONO,
            
            // The audio format. Currently PCM_16BIT and PCM_8BIT are supported. 
            // For convenience, use the audioinput.FORMAT constant to access the possible  
            // formats that the plugin supports. 
            format: audioinput.FORMAT.PCM_16BIT,
            
            // Specifies if the audio data should be normalized or not. 
            normalize: true,
            
            // Specifies the factor to use if normalization is performed. 
            normalizationFactor: 32767.0,
            
            // If set to true, the plugin will handle all conversion of the data to  
            // web audio. The plugin can then act as an AudioNode that can be connected  
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
            audioSourceType: sourceType
            
        };
    }
}