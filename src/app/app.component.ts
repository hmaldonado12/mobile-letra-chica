import { Component } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import {Platform} from "@ionic/angular";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.getPlatform() === 'web') {
        GoogleAuth.initialize({
          clientId: '889927933084-6o5i9bet4eemuovr7de4boa17a5gpkku.apps.googleusercontent.com',
          scopes: ['profile', 'email'],
          grantOfflineAccess: false,
        })
          .then(() => {
            console.log('GoogleAuth inicializado correctamente');
          })
          .catch((err) => {
            console.error('Error al inicializar GoogleAuth:', err);
          });
      }
    })
  }
}
