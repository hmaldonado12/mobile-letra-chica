import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {LogoComponent} from "../../../components/logo/logo.component";
import {SignInGoogleRepositoryService} from "../../infra/rest/sign-in-google-repository.service";
import { Capacitor } from '@capacitor/core';
import {AuthGoogleRepositoryService} from "../../infra/rest/auth-google-repository.service";
import {SaveInfoSessionService} from "../../infra/rest/save-info-session.service";
import { AuthService } from '../../infra/rest/auth.service';

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
  name: string = '';
  email: string = '';
  regPassword: string = '';
  isWeb = Capacitor.getPlatform() === 'web';
  token: string = '';
  isDarkMode = false;
  isLoading = false;
  showRegister = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private signInGoogleRepositoryService: SignInGoogleRepositoryService,
    private authGoogleRepositoryService: AuthGoogleRepositoryService,
    private saveInfoSessionService: SaveInfoSessionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('LoginPage');
    if (this.isWeb) {
      const interval = setInterval(() => {
        if (window.hasOwnProperty('google') && google.accounts && google.accounts.id) {
          google.accounts.id.initialize({
            client_id: '889927933084-c213n51cnolov6ec0rgo40579fstqahb.apps.googleusercontent.com',
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

  async handleCredentialsResponse(response: any) {
    const loading = await this.loadingController.create({
      message: 'Autenticando con Google...',
      spinner: 'circles'
    });
    await loading.present();

    this.token = response.credential;
    this.authGoogleRepositoryService.signInWithGoogle(this.token).subscribe({
      next: async (responseLetraChica) => {
        await loading.dismiss();
        const userID = responseLetraChica.message;
        this.saveInfoSessionService.saveSessionInfoByKey("userID", userID);
        console.log('✅ Respuesta del backend:', responseLetraChica);
        this.router.navigateByUrl('/contracts');
      },
      error: async (error) => {
        await loading.dismiss();
        console.error('❌ Error al enviar el ID Token al backend:', error);
        
        let errorMessage = 'Error de conexión con el servidor.';
        if (error.status === 400) {
          errorMessage = 'Token de Google inválido. Intenta iniciar sesión nuevamente.';
        }
        
        const alert = await this.alertController.create({
          header: '❌ Error de conexión',
          message: errorMessage,
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  async login() {
    if (!this.username.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      const alert = await this.alertController.create({
        header: 'Error de Login',
        message: 'Ingresa un email válido.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
    if (!this.password || this.password.length < 6) {
      const alert = await this.alertController.create({
        header: 'Error de Login',
        message: 'La contraseña debe tener al menos 6 caracteres.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'circles'
    });
    await loading.present();
    this.authService.login(this.username, this.password).subscribe({
      next: async (response) => {
        await loading.dismiss();
        if (response.token) {
          this.saveInfoSessionService.saveSessionInfoByKey('token', response.token);
          this.saveInfoSessionService.saveSessionInfoByKey('userID', response.message);
          this.router.navigateByUrl('/contracts');
        } else {
          const alert = await this.alertController.create({
            header: 'Error de Login',
            message: response.message || 'Credenciales inválidas.',
            buttons: ['OK'],
          });
          await alert.present();
        }
      },
      error: async (error) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error de Login',
          message: 'No se pudo conectar con el servidor o credenciales inválidas.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    });
  }

  async register() {
    if (!this.name.trim()) {
      const alert = await this.alertController.create({
        header: 'Error de registro',
        message: 'El nombre es obligatorio.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
    if (!this.email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      const alert = await this.alertController.create({
        header: 'Error de registro',
        message: 'Ingresa un email válido.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
    if (!this.regPassword || this.regPassword.length < 6) {
      const alert = await this.alertController.create({
        header: 'Error de registro',
        message: 'La contraseña debe tener al menos 6 caracteres.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
    const loading = await this.loadingController.create({
      message: 'Registrando usuario...',
      spinner: 'circles'
    });
    await loading.present();
    this.authService.register(this.name, this.email, this.regPassword).subscribe({
      next: async (response) => {
        await loading.dismiss();
        if (response.message && response.message.includes('exitosamente')) {
          this.saveInfoSessionService.saveSessionInfoByKey('userID', response.userId || response.message);
          const alert = await this.alertController.create({
            header: 'Registro exitoso',
            message: response.message,
            buttons: ['OK'],
          });
          await alert.present();
          this.showRegister = false;
        } else {
          const alert = await this.alertController.create({
            header: 'Error de registro',
            message: response.message || 'No se pudo registrar el usuario.',
            buttons: ['OK'],
          });
          await alert.present();
        }
      },
      error: async (error) => {
        await loading.dismiss();
        let msg = 'No se pudo conectar con el servidor.';
        if (error.status === 409) {
          msg = 'El usuario ya está registrado.';
        }
        const alert = await this.alertController.create({
          header: 'Error de registro',
          message: msg,
          buttons: ['OK'],
        });
        await alert.present();
      }
    });
  }

  toggleRegister() {
    this.showRegister = !this.showRegister;
  }
  async loginWithGoogle() {
    console.log('🔵 Iniciando proceso de login con Google...');
    if (Capacitor.getPlatform() === 'web') {
      const alert = await this.alertController.create({
        header: 'Plataforma no compatible',
        message: 'Por favor, utiliza la aplicación móvil para iniciar sesión con Google.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
    
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Autenticando con Google...',
      spinner: 'circles'
    });
    await loading.present();
    
    try {
      console.log('🔵 Llamando a signInGoogleRepositoryService.signInWithGoogle()...');
      const user = await this.signInGoogleRepositoryService.signInWithGoogle();
      console.log('🔵 Usuario obtenido del plugin:', JSON.stringify(user, null, 2));
      
      const token = user.idToken || user.authentication?.idToken;
      console.log('🔵 Token extraído:', token ? 'Token encontrado' : 'Token NO encontrado');
      
      if (!token) {
        await loading.dismiss();
        this.isLoading = false;
        console.error('❌ No se pudo obtener el idToken de Google.');
        const alert = await this.alertController.create({
          header: 'Error de autenticación',
          message: 'No se pudo obtener el token de Google. Intenta nuevamente.',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }
      
      console.log('🔵 Enviando token al backend...');
      this.authGoogleRepositoryService.signInWithGoogle(token).subscribe({
        next: async (responseLetraChica) => {
          await loading.dismiss();
          this.isLoading = false;
          console.log('✅ Respuesta exitosa del backend:', JSON.stringify(responseLetraChica, null, 2));
          const userID = responseLetraChica.message;
          this.saveInfoSessionService.saveSessionInfoByKey("userID", userID);
          console.log('✅ UserID guardado:', userID);
          
          // Navegar directamente sin mostrar alert adicional
          console.log('🔵 Navegando a /contracts...');
          this.router.navigateByUrl('/contracts');
        },
        error: async (error) => {
          await loading.dismiss();
          this.isLoading = false;
          console.error('❌ Error al enviar el ID Token al backend:', JSON.stringify(error, null, 2));
          
          let errorMessage = 'Error de conexión con el servidor.';
          if (error.status === 0) {
            errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet y que el backend esté funcionando.';
          } else if (error.status === 400) {
            errorMessage = 'Token de Google inválido. Intenta iniciar sesión nuevamente.';
          } else if (error.status >= 500) {
            errorMessage = 'Error interno del servidor. Intenta más tarde.';
          }
          
          const alert = await this.alertController.create({
            header: '❌ Error de conexión',
            message: errorMessage,
            buttons: ['OK']
          });
          await alert.present();
        }
      });
      console.log('🔵 Finalizando loginWithGoogle - Todo el flujo completado');
    } catch (error: any) {
      await loading.dismiss();
      this.isLoading = false;
      console.error('❌ Error capturado en loginWithGoogle:', JSON.stringify(error, null, 2));
      
      if (error.error === 'popup_closed_by_user' || 
          (error.message && error.message.includes('cancelled'))) {
        console.warn('⚠️ Login cancelado por el usuario.');
        return; // No mostrar alerta si el usuario canceló
      }
      
      const alert = await this.alertController.create({
        header: '❌ Error de login',
        message: 'Error desconocido al iniciar sesión.',
        buttons: ['OK']
      });
      await alert.present();
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
