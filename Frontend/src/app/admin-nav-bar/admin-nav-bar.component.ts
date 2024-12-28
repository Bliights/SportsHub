import { Component } from '@angular/core';
import {AuthService} from '../auth.service';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-admin-nav-bar',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './admin-nav-bar.component.html',
  styleUrl: './admin-nav-bar.component.css'
})
export class AdminNavBarComponent {

  constructor(private authService: AuthService , private router: Router) {}

  // Logout the user
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Navigate to a specific route
  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }
}
