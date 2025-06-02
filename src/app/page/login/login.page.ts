import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {LogoComponent} from "../../../components/logo/logo.component";
import {SignInGoogleRepositoryService} from "../../infra/rest/sign-in-google-repository.service";
import { Capacitor } from '@capacitor/core';

declare var google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, LogoComponent]
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';
  isWeb = Capacitor.getPlatform() === 'web';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private signInGoogleRepositoryService: SignInGoogleRepositoryService,
  ) {}

  ngOnInit(): void {
    console.log('LoginPage');
    if (this.isWeb) {
      const interval = setInterval(() => {
        if (window.hasOwnProperty('google') && google.accounts && google.accounts.id) {
          google.accounts.id.initialize({
            client_id: '889927933084-6o5i9bet4eemuovr7de4boa17a5gpkku.apps.googleusercontent.com',
            callback: (response: any) => this.handleCredentialsResponse(response),    
          });
          google.accounts.id.renderButton(
            document.getElementById('google-signin-btn'),
            { theme: 'outline', size: 'large' } // Personaliza el botón según tus necesidades
          );
          clearInterval(interval);
        }
      }, 100);
    }
  }

  handleCredentialsResponse(response: any) {
    console.log('ID Token recibido:', response.credential);
  }

  async login() {

    if (this.username && this.password) {
      this.router.navigateByUrl('/home');
    } else {
      const alert = await this.alertController.create({
        header: 'Error de Login',
        message: 'Por favor, ingresa un usuario y contraseña.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
  async loginWithGoogle() {
    if (Capacitor.getPlatform() === 'web') {
      alert('Por favor, utiliza la aplicación móvil para iniciar sesión con Google.');
      return;
    }
    try {
      const user = await this.signInGoogleRepositoryService.signInWithGoogle();
      console.log('Usuario autenticado:', user.email);
    } catch (error: any) {
      if (error.error === 'popup_closed_by_user') {
        console.warn('El usuario cerró la ventana emergente antes de completar el login.');
      } else {
        console.error('Error al iniciar sesión:', error.message || error);
      }
    }
  }
}
