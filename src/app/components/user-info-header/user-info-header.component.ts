import { Component, OnInit, OnDestroy } from '@angular/core';
import { RetrieveInfoSessionService } from '../../infra/rest/retrieve-info-session.service';
import { IonicModule } from "@ionic/angular";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-info-header',
  template: `
    <ion-toolbar color="light">
      <ion-title>
        {{ googleUsername ? 'Contratos de ' + googleUsername : 'Contratos de Invitado' }}
      </ion-title>
    </ion-toolbar>
  `,
  imports: [
    IonicModule
  ],
  styles: [`ion-toolbar {
    font-size: 14px;
  }`]
})
export class UserInfoHeaderComponent implements OnInit, OnDestroy {
  googleUsername: string = '';
  private sub?: Subscription;

  constructor(private session: RetrieveInfoSessionService) {}

  ngOnInit() {
    this.sub = this.session.googleUsername$.subscribe(name => {
      this.googleUsername = name || '';
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
