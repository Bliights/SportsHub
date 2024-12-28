import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticated: boolean = false;
  public userId: number = -1;
  public role: string = '';


  constructor() {
    this.isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
    const id = localStorage.getItem('userId')
    this.userId = id ? parseInt(id, 10) : -1;
    const role = localStorage.getItem('role')
  }

  login() {
    this.isAuthenticated = true;
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userId', this.userId.toString());
    localStorage.setItem('role', this.role);
  }

  logout() {
    this.isAuthenticated = false;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  }


}
