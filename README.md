# openoise-meter-ionic
## Introduction
OpeNoise Meter is a real-time noise level meter for Android and iOS smartphone and tablet.

This repository contains the ionic-capacitor source files. 

See the released apps in the official markets:
- Android: https://play.google.com/store/apps/details?id=it.piemonte.arpa.openoise
- iOS: https://itunes.apple.com/us/app/openoise/id1387499991?l=it&ls=1&mt=8
    
    
## Features
- Real-time A-weighted sound pressure level measurement
- Minimum and maximum level
- Third octave and FFT analysis
- Data saving in text file
- Calibration
- Displaying measurements on a map
- Metadata compilation
- Sharing calibration and measurements with the OpeNoise community


## Term of use
This app is not intended for professional use, it does not necessarily
guarantee an accurate noise measurement.


Since each device has a different response to noise, a comparison with a
professional noise level meter in the measurement dynamic range is
required.


The utilization of the app requires adequate technical knowledge and
skill; an extemporary measurement might not be correct.


For more information, please refer to the device calibration and dynamic
range specifications in the Tutorial section.


The calibrations and measurements sent to the OpeNoise community will be
used for statistical purposes only and cannot be used in any way to verify
compliance with legal limits.


## Developers
Arpa Piemonte (Regional Agency for the Protection of the Environment of Piedmont - Italy - www.arpa.piemonte.it).


## Contacts
openoise@arpa.piemonte.it

## Requirements

```
Ionic:

   Ionic CLI                     : 7.2.0
   Ionic Framework               : @ionic/angular 8.1.0
   @angular-devkit/build-angular : 17.3.6
   @angular-devkit/schematics    : 17.3.6
   @angular/cli                  : 17.3.6
   @ionic/angular-toolkit        : 11.0.1

Capacitor:

   Capacitor CLI      : 6.0.0
   @capacitor/android : 6.0.0
   @capacitor/core    : 6.0.0
   @capacitor/ios     : 6.0.0

Utility:

   cordova-res : not installed globally
   native-run  : 2.0.1

System:

   NodeJS : v20.15.0
   npm    : 10.7.0
```