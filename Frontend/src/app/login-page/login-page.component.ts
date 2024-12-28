import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {NavBarComponent} from '../nav-bar/nav-bar.component';
import {AuthService} from '../auth.service';
import {UsersService} from '../api/users.service';
import { User } from '../../generated';
import {map, Observable, throwError} from 'rxjs';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NavBarComponent,
    RouterLink
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  loginForm: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder, private authService: AuthService, private usersService: UsersService) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // Check if the user exists and their password matches
  checkCredentials(email: string, password: string): Observable<boolean> {
    return this.usersService.getAllUsers().pipe(
      map((users) => {
        const user = users.find((u) => u.email === email && u.password === password);
        if (user) {
          // If credential ok we will connect with this user
          this.authService.userId = user.id;
          this.authService.role = user.role;
          return true;
        }
        return false;
      })
    );
  }

  // Handle login form submission
  onSubmitLogin(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.checkCredentials(email, password).subscribe({
        next: (isValid) => {
          if (isValid) {
            this.authService.login();
            const isAdmin = this.authService.role === 'admin';
            this.router.navigate([isAdmin ? '/admin-orders' : '/']);
          } else {
            console.log('Invalid credentials');
          }
        }
      });
    }
  }
}
