import { Component , OnInit} from '@angular/core';
import {NavBarComponent} from '../nav-bar/nav-bar.component';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import { UsersService } from '../../generated';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-edit-account',
  standalone: true,
  imports: [
    NavBarComponent,
    RouterLink,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './edit-account.component.html',
  styleUrl: './edit-account.component.css'
})
export class EditAccountComponent implements OnInit{
  changePassword: FormGroup;
  changeEmail: FormGroup;
  changeName: FormGroup;
  user: any;

  constructor(formBuilder: FormBuilder, private usersService: UsersService, private authService: AuthService, private router: Router) {
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

  loadUserInfo(): void {

    if (this.authService.idUser === -1 || this.authService.idUser === null) {
      console.log('User not authenticated.');
      return;
    }

    this.usersService.apiUsersIdGet(this.authService.idUser).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err) => {
        console.error('Failed to load user info:', err);
      },
    });
  }


  onSubmitPassword() {
    const { oldPassword, newPassword } = this.changePassword.value;
    this.authService.changePassword(this.authService.idUser, oldPassword, newPassword).subscribe(response => {
      if (response) {
        console.log('Password changed');
      } else {
        console.log('Error changing password');
      }
    });
  }

  onSubmitEmail() {
    //change the email of the user
    this.authService.changeEmail(this.changeEmail.value.email).subscribe(id=>{
      if(id != -1){
        console.log('Email changed');
        this.loadUserInfo();
      }else{
        console.log('Error changing email');
      }
    });
  }

  onSubmitName() {
    const { username } = this.changeName.value;
    this.authService.changeName(this.authService.idUser, username).subscribe(response => {
      if (response) {
        console.log('Name changed');
        this.loadUserInfo();
      } else {
        console.log('Error changing name');
      }
    });
  }

  onClickLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
