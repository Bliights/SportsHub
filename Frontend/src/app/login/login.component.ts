import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NavBarComponent} from '../nav-bar/nav-bar.component';

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
  constructor(private router: Router, formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
      email: ['',Validators.required],
      password: ['',Validators.required]
    });
  }

  onSubmitLogin() {

  }
}
