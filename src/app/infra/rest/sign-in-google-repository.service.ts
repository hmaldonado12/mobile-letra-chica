import { Injectable } from '@angular/core';
import { RetrieveInfoSessionService } from './retrieve-info-session.service';
import { FirebaseAuthService } from './firebase-auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignInGoogleRepositoryService {

  constructor(
    private session: RetrieveInfoSessionService,
    private firebaseAuth: FirebaseAuthService
  ) {}

  async signInWithGoogle(): Promise<any> {
    try {
      console.log('🔥 Iniciando login con Firebase Auth...');
      
      const result = await this.firebaseAuth.signInWithGoogle();
      
      if (!result) {
        throw new Error('Login cancelado por el usuario');
      }

      const user = result.user;
      const idToken = result.idToken;
      
      // Guardar información en sesión
      this.session.setSessionInfoByKey('googleUsername', user.displayName || '');
      console.log('📧 Email del usuario:', user.email);
      console.log('👤 Nombre del usuario:', user.displayName);
      console.log('🔑 ID Token obtenido');
      
      // Retornar datos en el formato esperado por el resto de la aplicación
      return {
        idToken: idToken,
        email: user.email,
        name: user.displayName,
        givenName: user.displayName?.split(' ')[0] || '',
        familyName: user.displayName?.split(' ')[1] || '',
        imageUrl: user.photoURL,
        uid: user.uid,
        // Para compatibilidad con el código existente
        authentication: {
          idToken: idToken
        }
      };
      
    } catch (error: any) {
      console.error('❌ Error en login con Firebase:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      await this.firebaseAuth.signOut();
      console.log('🚪 Logout de Firebase completado');
    } catch (error) {
      console.error('❌ Error en logout Firebase:', error);
      throw error;
    }
  }
}
