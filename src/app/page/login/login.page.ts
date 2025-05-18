import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    FormsModule,
    IonicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginPage {
  constructor(private router: Router) {}

  onLogin() {
    this.router.navigate(['/home']);
  }
}
