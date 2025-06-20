import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {LogoComponent} from "../../../components/logo/logo.component";
import {SignInGoogleRepositoryService} from "../../infra/rest/sign-in-google-repository.service";
import { Capacitor } from '@capacitor/core';
import {AuthGoogleRepositoryService} from "../../infra/rest/auth-google-repository.service";
import {SaveInfoSessionService} from "../../infra/rest/save-info-session.service";

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
  token: string = '';
  isDarkMode = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private signInGoogleRepositoryService: SignInGoogleRepositoryService,
    private authGoogleRepositoryService: AuthGoogleRepositoryService,
    private saveInfoSessionService: SaveInfoSessionService
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
            { theme: 'outline', size: 'large' }
          );
          clearInterval(interval);
        }
      }, 100);
    }
    this.isDarkMode = document.body.classList.contains('dark');
  }

  handleCredentialsResponse(response: any) {
    this.token = response.credential;
    this.authGoogleRepositoryService.signInWithGoogle(this.token).subscribe({
      next: (responseLetraChica) => {
        const userID = responseLetraChica.message;
        this.saveInfoSessionService.saveSessionInfoByKey("userID", userID);
        console.log('✅ Respuesta del backend:', responseLetraChica);
        this.router.navigateByUrl('/contracts');
      },
      error: (error) => {
        console.error('❌ Error al enviar el ID Token al backend:', error);
      }
    });
  }

  async login() {

    if (this.username && this.password) {
      // Guardar usuario y contraseña en sesión
      this.saveInfoSessionService.saveSessionInfoByKey('username', this.username);
      this.saveInfoSessionService.saveSessionInfoByKey('password', this.password);
      this.router.navigateByUrl('/contracts');
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
      const token = user.idToken || user.authentication?.idToken;
      if (!token) {
        console.error('No se pudo obtener el idToken de Google.');
        return;
      }
      this.authGoogleRepositoryService.signInWithGoogle(token).subscribe({
        next: (responseLetraChica) => {
          const userID = responseLetraChica.message;
          this.saveInfoSessionService.saveSessionInfoByKey("userID", userID);
          console.log('✅ Respuesta del backend:', responseLetraChica);
          this.router.navigateByUrl('/contracts');
        },
        error: (error) => {
          console.error('❌ Error al enviar el ID Token al backend:', error);
        }
      });
    } catch (error: any) {
      if (error.error === 'popup_closed_by_user') {
        console.warn('El usuario cerró la ventana emergente antes de completar el login.');
      } else {
        console.error('Error al iniciar sesión:', error.message || error);
      }
    }
  }

  onGoogleBtnClick() {
    if (this.isWeb) {
      // Dispara el flujo de Google Identity Services manualmente
      if (window.hasOwnProperty('google') && google.accounts && google.accounts.id) {
        google.accounts.id.prompt();
      } else {
        alert('No se pudo cargar el servicio de Google. Intenta recargar la página.');
      }
    } else {
      this.loginWithGoogle();
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
}
