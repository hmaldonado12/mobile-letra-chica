import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import {IonicModule} from "@ionic/angular";
import { SaveInfoSessionService } from '../../infra/rest/save-info-session.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-footer',
  template: `
    <ion-footer>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button *ngIf="showLogoutInsteadOfBack(); else backBtn" (click)="logout()">
            <ion-icon name="log-out-outline"></ion-icon>
            Cerrar sesión
          </ion-button>
          <ng-template #backBtn>
            <ion-button (click)="goBack()">
              <ion-icon name="arrow-back-outline"></ion-icon>
              Atrás
            </ion-button>
          </ng-template>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button *ngIf="!isContractsPage()" (click)="goHome()">
            <ion-icon name="home-outline"></ion-icon>
            Home
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  `,
  imports: [
    IonicModule,
    CommonModule,
    NgIf
  ],
  styles: [`ion-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
  }`]
})
export class AppFooterComponent {
  constructor(private location: Location, private router: Router, private saveInfoSession: SaveInfoSessionService) {}

  goBack() {
    this.location.back();
  }

  goHome() {
    this.router.navigate(['/contracts']);
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  showLogoutInsteadOfBack(): boolean {
    // Cambia la ruta según la primera pantalla post-login de tu app
    const currentUrl = this.router.url;
    return currentUrl === '/contracts' || currentUrl === '/home';
  }

  isContractsPage(): boolean {
    return this.router.url.includes('/contracts');
  }
}
