import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RetrieveInfoSessionService {
  private googleUsernameSubject = new BehaviorSubject<string>(this.getSessionInfoByKey('googleUsername') || '');
  googleUsername$ = this.googleUsernameSubject.asObservable();

  constructor() { }

  getSessionInfoByKey(key: string): any {
    const value = sessionStorage.getItem(key);
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return value;
    }
  }

  setSessionInfoByKey(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
    if (key === 'googleUsername') {
      this.googleUsernameSubject.next(value);
    }
  }
}
