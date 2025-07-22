import { Component } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-theme-toggle',
  template: `
    <ion-button (click)="toggleTheme()" fill="clear">
      <ion-icon [name]="isDarkMode ? 'moon' : 'sunny'" slot="icon-only"></ion-icon>
    </ion-button>
  `,
  imports: [
    IonicModule
  ],
  styles: [`ion-button {
    margin-left: 8px;
  }`]
})
export class ThemeToggleComponent {
  isDarkMode = false;

  constructor() {
    this.isDarkMode = document.body.classList.contains('dark');
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

