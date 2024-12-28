import {Component, inject} from '@angular/core';
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

  constructor(private authService: AuthService , private router: Router) {}

  // Redirect to the Edit profile page
  onClickEditProfile() {
    //if connected redirect to Profile page, else, redirect to login page
    if(this.authService.isAuthenticated){
      this.router.navigate(['/edit-account'])
    }else{
      this.router.navigate(['/login'])

    }
  }

  // Redirect to the cart page
  onClickCart() {
    //if connected redirect to Profile page, else, redirect to login page
    if(this.authService.isAuthenticated){
      this.router.navigate(['/cart']);
    }else{
      this.router.navigate(['/login']);
    }
  }

  // Redirect to the help page
  onClickHelp() {
    //if connected redirect to Profile page, else, redirect to login page
    if(this.authService.isAuthenticated){
      this.router.navigate(['/help']);
    }else{
      this.router.navigate(['/login']);
    }
  }

  // Redirect to the preferences page
  onClickPreferences() {
    //if connected redirect to Profile page, else, redirect to login page
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/preferences']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Redirect to the orders page
  onClickOrders() {
    //if connected redirect to Profile page, else, redirect to login page
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/orders']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
