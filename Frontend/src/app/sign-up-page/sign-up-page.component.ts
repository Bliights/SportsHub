import { Component } from '@angular/core';
import {NavBarComponent} from '../nav-bar/nav-bar.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../auth.service';
import {UsersService} from '../api/users.service';
import {map} from 'rxjs';

@Component({
  selector: 'app-sign-up-page',
  standalone: true,
  imports: [
    NavBarComponent,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.css'
})
export class SignUpPageComponent {
  signupForm: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder, private usersService: UsersService) {
    this.signupForm = formBuilder.group({
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // Check if the account already exists
  accountExist(email: string){
    return this.usersService.getAllUsers().pipe(
      map(users => !!users.find(u => u.email === email))
    );
  }

  // Create a new account
  onSubmitSignup() {
    if (this.signupForm.valid) {
      this.accountExist(this.signupForm.value.email).subscribe(user => {
        if (!user) {
          this.usersService.addUser(this.signupForm.value.username, this.signupForm.value.email, this.signupForm.value.password, "customer").subscribe(res=>
          {
              this.router.navigate(['/login']);
          });

        } else {
          console.log('Invalid credentials');
        }
      });
    }
  }

}
