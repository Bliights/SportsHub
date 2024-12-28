import { inject, Injectable } from '@angular/core';
import { User, UsersService as SwaggerUsersService, ApiUsersBody, UsersIdBody } from '../../generated';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  constructor(private usersService: SwaggerUsersService) {}

  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.usersService.apiUsersGet().pipe(
      map((response: User[]) => response),
      catchError((error) => {
        console.error('Failed to fetch users:', error);
        return throwError(() => new Error('Failed to fetch users.'));
      })
    );
  }

  // Get user by ID
  getUserById(userId: number): Observable<User> {
    return this.usersService.apiUsersIdGet(userId).pipe(
      map((response: User) => response),
      catchError((error) => {
        console.error(`Failed to fetch user with ID ${userId}:`, error);
        return throwError(() => new Error(`Failed to fetch user with ID ${userId}.`));
      })
    );
  }

  // Delete user by ID
  deleteUser(userId: number): Observable<void> {
    return this.usersService.apiUsersIdDelete(userId).pipe(
      map(() => undefined),
      catchError((error) => {
        console.error(`Failed to delete user with ID ${userId}:`, error);
        return throwError(() => new Error(`Failed to delete user with ID ${userId}.`));
      })
    );
  }

  // Add a new user
  addUser(name: string, email: string, password: string, role: string): Observable<User> {
    const body: ApiUsersBody = {
      name: name,
      email: email,
      password: password,
      role: role
    };
    return this.usersService.apiUsersPost(body).pipe(
      map((response: User) => response),
      catchError((error) => {
        console.error('Failed to add user:', error);
        return throwError(() => new Error('Failed to add user.'));
      })
    );
  }

  // Update user details
  updateUser(userId: number, name?: string, email?: string, password?: string, role?: string): Observable<User> {
    const body: UsersIdBody = {};

    if (name !== undefined) body.name = name;
    if (email !== undefined) body.email = email;
    if (password !== undefined) body.password = password;
    if (role !== undefined) body.role = role;

    return this.usersService.apiUsersIdPut(body, userId).pipe(
      map((response: User) => response),
      catchError((error) => {
        console.error(`Failed to update user with ID ${userId}:`, error);
        return throwError(() => new Error(`Failed to update user with ID ${userId}.`));
      })
    );
  }
}
