import { Injectable } from '@angular/core';
import { RetrieveInfoSessionService } from './retrieve-info-session.service';
import { GoogleAuthWebViewService } from './google-auth-webview.service';

@Injectable({
  providedIn: 'root'
})
export class SignInGoogleRepositoryService {

  constructor(
    private session: RetrieveInfoSessionService,
    private googleAuthWebView: GoogleAuthWebViewService
  ) {}

  async signInWithGoogle(): Promise<any> {
    try {
      console.log('🚀 Iniciando login con Google...');
      
      const response = await this.googleAuthWebView.signInWithGoogle();
      
      console.log('✅ Respuesta de GoogleAuthWebView:', JSON.stringify(response, null, 2));
      
      const userName = response.profile?.name || response.profile?.givenName || '';
      this.session.setSessionInfoByKey('googleUsername', userName);
      console.log('📧 Email del usuario:', response.profile?.email);
      console.log('👤 Nombre del usuario:', userName);
      
      // Retornar los datos en el formato esperado por el resto de tu aplicación
      const result = {
        name: response.profile?.name,
        givenName: response.profile?.givenName,
        email: response.profile?.email,
        idToken: response.idToken,
        profile: response.profile
      };
      
      console.log('🎉 Login exitoso, retornando:', JSON.stringify(result, null, 2));
      return result;
        
    } catch (error) {
      console.error('❌ Error en login con Google:', error);
      console.error('❌ Detalles del error:', JSON.stringify(error, null, 2));
      throw error;
    }
  }

  async signOut() {
    // Para WebView no necesitamos logout específico
    console.log('🚪 Logout de Google (WebView)');
  }
}
