import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {NavBarComponent} from '../nav-bar/nav-bar.component';
import {SearchBarComponent} from '../search-bar/search-bar.component';

export interface SignUpPackage {
  username: string;
  password: string;
  email: string;
  dateOfBirth: Date;
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NavBarComponent,
    SearchBarComponent
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  title = 'SportsHub';
  mode: SignUpPackage = {username: '', password: '', email: '', dateOfBirth: new Date()};
  signupForm: FormGroup;

  constructor(private router: Router, formBuilder: FormBuilder) {
    this.signupForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
      dateOfBirth: ['', Validators.required]
    });
  }

  onSubmitSignup() {

  }
}
