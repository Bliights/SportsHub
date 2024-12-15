import { Component } from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  constructor(private authService: AuthService, private router: Router) {
  }
  onClickEditProfile() {
    //if connected redirect to Profile page, else, redirect to login page
    if(this.authService.isAuthenticated){
      this.router.navigate(['/edit-account'])
    }else{
      //redirect to login page
      this.router.navigate(['/login'])

    }
  }

  onClickCart() {
    if(this.authService.isAuthenticated){
      this.router.navigate(['/cart']);
    }else{
      this.router.navigate(['/login']);

    }
  }

  onClickHelp() {
    if(this.authService.isAuthenticated){
      this.router.navigate(['/help']);
    }else{
      this.router.navigate(['/login']);

    }
  }

  onClickPreferences() {
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/preferences']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  onClickOrders() {
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/user-orders']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
