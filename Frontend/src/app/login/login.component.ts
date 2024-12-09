import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NavBarComponent} from '../nav-bar/nav-bar.component';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NavBarComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private router: Router, formBuilder: FormBuilder, private authService: AuthService) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  onSubmitLogin() {
    this.authService.accountExist(this.loginForm.value.email).subscribe(isThisUserValid => {
      if (isThisUserValid) {
        this.authService.authSuccessful(this.loginForm.value.email, this.loginForm.value.password).subscribe(isThisPasswordValid => {
          if (isThisPasswordValid && this.loginForm.valid) {
            this.authService.isAuthenticated = true;
            this.authService.getUserId(this.loginForm.value.email).subscribe(id => {
              this.authService.idUser = id;
              this.router.navigate(['/']);
            });
          } else {
            console.log('Invalid credentials');
          }
        });
      } else {
        console.log('Invalid credentials');
      }
    });
  }
}
