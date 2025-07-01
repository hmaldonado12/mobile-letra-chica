import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'letra chica',
  webDir: 'www',
  server: {
    // Para desarrollo - permitir certificados autofirmados
    cleartext: true,
    allowNavigation: ['192.168.0.59:8443']
  },
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com']
    }
  }
};

export default config;
