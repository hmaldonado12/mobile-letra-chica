import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-launch-screen',
  templateUrl: './launch-screen.page.html',
  styleUrls: ['./launch-screen.page.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class LaunchScreenPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 5000);
  }
}
