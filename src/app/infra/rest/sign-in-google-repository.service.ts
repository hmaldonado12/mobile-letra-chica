import { Injectable } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { RetrieveInfoSessionService } from './retrieve-info-session.service';

@Injectable({
  providedIn: 'root'
})
export class SignInGoogleRepositoryService {
  constructor(private session: RetrieveInfoSessionService) {}

  async signInWithGoogle(): Promise<any> {
    try {
      const googleUser = await GoogleAuth.signIn();
      this.session.setSessionInfoByKey('googleUsername', googleUser.name || googleUser.givenName || '');
      console.log('email_user:', googleUser.email);
      return googleUser;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }

  async signOut() {
    await GoogleAuth.signOut();
  }
}
