import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-admin-nav-bar',
  templateUrl: './admin-nav-bar.component.html',
  standalone: true,
  imports: [
    RouterLink
  ],
  styleUrls: ['./admin-nav-bar.component.css']
})
export class AdminNavBarComponent {

  constructor(private router: Router, private authService:AuthService) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
