import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'letra chica',
  webDir: 'www',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '889927933084-46ddd2ngoomn04qc7e6s1tiq12hn3t8b.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
