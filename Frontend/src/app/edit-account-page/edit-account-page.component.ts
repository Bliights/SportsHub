import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import { User } from '../../generated';
import {UsersService} from '../api/users.service';
import {NavBarComponent} from '../nav-bar/nav-bar.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-edit-account-page',
  standalone: true,
  imports: [
    NavBarComponent,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './edit-account-page.component.html',
  styleUrl: './edit-account-page.component.css'
})
export class EditAccountPageComponent implements OnInit{
  changePassword: FormGroup;
  changeEmail: FormGroup;
  changeName: FormGroup;
  user: User| undefined;

  constructor(formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private usersService: UsersService,
  ) {
    this.changePassword = formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
    });
    this.changeEmail = formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.changeName = formBuilder.group({
      username: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserInfo();
  }

  // Load user information
  loadUserInfo(): void {
    const userId = this.authService.userId;
    this.usersService.getUserById(userId).subscribe({
      next: (user) => (this.user = user)
    });
  }

  // Update password
  onSubmitPassword(): void {
    if (this.changePassword.valid) {
      const { oldPassword, newPassword } = this.changePassword.value;
      const userId = this.authService.userId;

      // Check if old password is correct
      this.usersService.getUserById(userId).subscribe({
        next: (user) => {
          if (user.password !== oldPassword) {
            alert('The old password is incorrect. Please try again.');
            this.changePassword.reset();
            return;
          }

          // If correct old password then update the password
          this.usersService.updateUser(userId, undefined, undefined, newPassword).subscribe({
            next: () => {
              console.log('Password updated successfully');
              alert('Password updated successfully');
              this.changePassword.reset();
              this.loadUserInfo();
            },
            error: () => {
              console.error('Failed to update password');
              alert('Failed to update password. Please try again.');
              this.changePassword.reset();
            }
          });
        },
        error: () => {
          console.error('Failed to validate old password');
          alert('Failed to validate old password. Please try again.');
          this.changePassword.reset();
        }
      });
    }
  }

  // Update email
  onSubmitEmail(): void {
    if (this.changeEmail.valid) {
      const { email } = this.changeEmail.value;
      const userId = this.authService.userId;

      this.usersService.updateUser(userId, undefined, email).subscribe({
        next: () => {
          console.log('Email updated successfully');
          alert('Email updated successfully');
          this.changeEmail.reset();
          this.loadUserInfo();
        },
        error: () => {
          console.error('Failed to update email');
          alert('Failed to update email. Please try again.');
          this.changeEmail.reset();
        }
      });
    }
  }

  // Update name
  onSubmitName(): void {
    if (this.changeName.valid) {
      const { username } = this.changeName.value;
      const userId = this.authService.userId;

      this.usersService.updateUser(userId, username).subscribe({
        next: () => {
          console.log('Name updated successfully');
          alert('Name updated successfully');
          this.changeName.reset();
          this.loadUserInfo();
        },
        error: () => {
          console.error('Failed to update name');
          alert('Failed to update name. Please try again.');
          this.changeName.reset();
        }
      });
    }
  }

  // Logout the user
  onClickLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}