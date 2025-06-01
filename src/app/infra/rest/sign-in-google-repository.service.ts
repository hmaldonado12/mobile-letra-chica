import { Injectable } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Injectable({
  providedIn: 'root'
})
export class SignInGoogleRepositoryService {

  async signInWithGoogle(): Promise<any> {
    try {
      const googleUser = await GoogleAuth.signIn();
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
