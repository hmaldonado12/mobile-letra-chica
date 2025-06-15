import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaveInfoSessionService {

  constructor() { }

  saveSessionInfoByKey(key: string, value: any): void {
    const data = typeof value === 'string' ? value : JSON.stringify(value);
    sessionStorage.setItem(key, data);
  }
}
