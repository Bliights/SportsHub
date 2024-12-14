import {Component, inject} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { AuthService } from '../auth.service';
import {UsersService} from '../../generated';

export interface SignUpPackage {
  email: string;
  username: string;
  password: string;

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
  signupForm: FormGroup;
  private readonly authService = inject(AuthService);

  constructor(private router: Router, formBuilder: FormBuilder) {
    this.signupForm = formBuilder.group({
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmitSignup() {

    if (this.signupForm.valid) {
      this.authService.accountExist(this.signupForm.value.email).subscribe(user => {
        if (!user) {
          this.authService.addUser(this.signupForm.value.username, this.signupForm.value.email, this.signupForm.value.password).subscribe(res=>
          {
            if(res!=-1)
              this.router.navigate(['/login']);
          });

        } else {
          console.log('Invalid credentials');
        }
      });
    }
  }

}
