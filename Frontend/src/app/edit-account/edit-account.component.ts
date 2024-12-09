import { Component } from '@angular/core';
import {NavBarComponent} from '../nav-bar/nav-bar.component';
import {RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-edit-account',
  standalone: true,
  imports: [
    NavBarComponent,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './edit-account.component.html',
  styleUrl: './edit-account.component.css'
})
export class EditAccountComponent {
  changePassword: FormGroup;
  changeEmail: FormGroup;
  changeName: FormGroup;

  constructor(formBuilder: FormBuilder, private authService: AuthService) {
    this.changePassword = formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
    });
    this.changeEmail = formBuilder.group({
      email: ['', Validators.required]
    });
    this.changeName = formBuilder.group({
      username: ['', Validators.required]
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
      } else {
        console.log('Error changing name');
      }
    });
  }
}
