import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-launch-screen',
  templateUrl: './launch-screen.page.html',
  styleUrls: ['./launch-screen.page.scss'],
  standalone: false,
})
export class LaunchScreenPage {
  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 4000);
  }
}
