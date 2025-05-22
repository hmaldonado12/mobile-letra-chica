import { Router } from '@angular/router';

export class LoginPage {
  constructor(private router: Router) {}

  onLogin() {
    this.router.navigate(['/home']);
  }
}
