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
  onClickProfile() {
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
}
