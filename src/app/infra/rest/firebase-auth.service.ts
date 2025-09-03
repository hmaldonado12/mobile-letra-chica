import { Injectable } from '@angular/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  constructor() {}

  async signInWithGoogle(): Promise<{ idToken: string; user: any } | null> {
    try {
      console.log('🔥 Iniciando login con Firebase Auth nativo...');
      console.log('📱 Plataforma:', Capacitor.getPlatform());
      
      // Usar el plugin nativo de Capacitor Firebase
      const result = await FirebaseAuthentication.signInWithGoogle();
      
      console.log('✅ Login exitoso con Firebase nativo');
      console.log('🔑 Respuesta completa:', JSON.stringify(result, null, 2));

      if (result.user && result.credential) {
        console.log('👤 Usuario:', result.user.displayName);
        console.log('📧 Email:', result.user.email);
        console.log('🔑 ID Token obtenido');

        return {
          idToken: result.credential.idToken || '',
          user: {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoUrl
          }
        };
      }

      console.warn('⚠️ No se obtuvo usuario o credencial');
      return null;
    } catch (error: any) {
      console.error('❌ Error en Firebase Auth nativo:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await FirebaseAuthentication.signOut();
      console.log('🚪 Usuario deslogueado de Firebase');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const result = await FirebaseAuthentication.getCurrentUser();
      return result.user;
    } catch (error) {
      console.error('❌ Error al obtener usuario actual:', error);
      return null;
    }
  }
}
