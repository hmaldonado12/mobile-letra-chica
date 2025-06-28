import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'letra chica',
  webDir: 'www',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '889927933084-6o5i9bet4eemuovr7de4boa17a5gpkku.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
