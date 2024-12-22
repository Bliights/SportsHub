import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../generated';
import { AdminNavBarComponent } from '../admin-nav-bar/admin-nav-bar.component';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-user-management',
  templateUrl: './admin-user-management.component.html',
  standalone: true,
  imports: [
    AdminNavBarComponent,
    FormsModule,
    NgIf,
    NgForOf,
    ReactiveFormsModule
  ],
  styleUrls: ['./admin-user-management.component.css']
})
export class AdminUserManagementComponent implements OnInit {
  users: any[] = [];
  newUserForm: FormGroup;
  editUserForm: FormGroup;
  editUserId: string | null = null;

  constructor(private userService: UsersService, private formBuilder: FormBuilder) {
    this.newUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['customer', Validators.required]
    });

    this.editUserForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['customer', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.apiUsersGet().subscribe(users => {
      this.users = users;
    });
  }

  addUser(): void {
    if (this.newUserForm.valid) {
      this.userService.apiUsersPost(this.newUserForm.value).subscribe(() => {
        this.loadUsers();
        this.newUserForm.reset({ role: 'customer' });
      });
    }
  }

  edit(user: any): void {
    this.editUserId = user.id;
    this.editUserForm.setValue({
      id: user.id,
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    });
  }

  updateUser(): void {
    if (this.editUserForm.valid) {
      this.userService.apiUsersIdPut(this.editUserForm.value,this.editUserForm.value.id).subscribe(() => {
        this.loadUsers();
        this.editUserForm.reset({ role: 'customer' });
        this.editUserId = null;
      });
    }
  }

  deleteUser(userId: string): void {
    this.userService.apiUsersIdDelete(userId).subscribe(() => {
      this.loadUsers();
    });
  }
}
