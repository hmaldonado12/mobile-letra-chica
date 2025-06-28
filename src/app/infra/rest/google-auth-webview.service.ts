import { Injectable } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

interface GoogleAuthResult {
  idToken: string;
  profile: {
    id: string;
    email: string;
    name: string;
    givenName: string;
    familyName: string;
    imageUrl?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthWebViewService {
  private webClientId = '889927933084-6o5i9bet4eemuovr7de4boa17a5gpkku.apps.googleusercontent.com';
  private pendingPromise: {resolve: Function, reject: Function} | null = null;

  constructor() {
    // Escuchar cuando el browser se cierre
    if (Capacitor.getPlatform() !== 'web') {
      Browser.addListener('browserFinished', () => {
        console.log('🔍 Browser cerrado');
        if (this.pendingPromise) {
          this.pendingPromise.reject(new Error('Login cancelado por el usuario'));
          this.pendingPromise = null;
        }
      });
    }
  }

  async signInWithGoogle(): Promise<GoogleAuthResult> {
    console.log('🚀 Iniciando autenticación con Google usando Browser API...');
    
    return new Promise(async (resolve, reject) => {
      try {
        this.pendingPromise = { resolve, reject };
        
        // Crear URL de Google OAuth con redirect a una página que cierre el browser
        const redirectUri = 'https://accounts.google.com/logout'; // Página que cierra sesión después del login
        const authUrl = `https://accounts.google.com/oauth/authorize?` +
          `client_id=${this.webClientId}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `response_type=code&` +
          `scope=openid email profile&` +
          `access_type=offline&` +
          `prompt=select_account`;
        
        console.log('🔗 Abriendo Google OAuth en browser...');
        console.log('🌐 URL:', authUrl);
        
        // Abrir browser con Google OAuth
        await Browser.open({ 
          url: authUrl,
          presentationStyle: 'popover'
        });
        
        console.log('✅ Browser abierto con Google OAuth');
        console.log('ℹ️  El usuario debe completar el login y cerrar el browser para continuar');
        
        // Simular resultado exitoso después de un delay
        // En una implementación real, esto requeriría un backend para intercambiar el código
        setTimeout(() => {
          if (this.pendingPromise) {
            const mockResult: GoogleAuthResult = {
              idToken: 'mock_id_token_' + Date.now(),
              profile: {
                id: 'mock_user_' + Date.now(),
                email: 'usuario@gmail.com',
                name: 'Usuario Test',
                givenName: 'Usuario',
                familyName: 'Test',
                imageUrl: 'https://via.placeholder.com/96'
              }
            };
            
            console.log('✅ Login simulado exitoso');
            this.pendingPromise.resolve(mockResult);
            this.pendingPromise = null;
          }
        }, 5000); // 5 segundos para simular el proceso
        
        // Timeout de seguridad
        setTimeout(() => {
          if (this.pendingPromise) {
            this.pendingPromise.reject(new Error('Timeout: Login cancelado después de 2 minutos'));
            this.pendingPromise = null;
          }
        }, 120000); // 2 minutos
        
      } catch (error) {
        console.error('❌ Error al abrir browser:', error);
        this.pendingPromise = null;
        reject(error);
      }
    });
  }
}
