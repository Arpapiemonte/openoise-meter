import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'it.piemonte.arpa.openoise',
  appName: 'OpeNoise',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
   plugins: {
      CapacitorCookies: {
        enabled: true,
      },
     CapacitorHttp: {
       enabled: true,
     },
   },
};

export default config;
