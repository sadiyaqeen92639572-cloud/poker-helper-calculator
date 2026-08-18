import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pokerhelpercalculator.app',
  appName: 'Poker Helper Calculator',
  webDir: 'public',
  server: {
    url: 'https://pokerhelpercalculator.com',
    cleartext: false
  }
};

export default config;
