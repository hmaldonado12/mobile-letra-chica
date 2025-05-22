import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {LogoComponent} from "../../components/logo/logo.component";

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

  constructor(private router: Router, private alertController: AlertController) {}

  ngOnInit() {}

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
}
