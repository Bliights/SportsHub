import {inject, Injectable} from '@angular/core';
import {UsersService} from '../generated';
import {Observable, of} from 'rxjs';
import {map, catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly usersService = inject(UsersService);
  public isAuthenticated: boolean = false;
  public idUser: number = -1;

  constructor() {
    this.isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
    const id = localStorage.getItem('id')
    this.idUser = id ? parseInt(id, 10) : -1;
  }

  authSuccessful(email: string, password: string): Observable<boolean> {
    return this.usersService.apiUsersGet().pipe(
      map((userList: any[]) => {
        const user = userList.find(
          (user: any) => user.email === email && user.password === password
        );
        if (user) {
          this.idUser = user.id;
          console.log(user, user.id, this.idUser);
          return true;
        }
        return false;
      }),
      catchError((error: any) => {
        console.error('Error whith authent:', error);
        return of(false);
      })
    );
  }

  isAdmin(id: number): Observable<boolean> {
    return this.usersService.apiUsersIdGet(id).pipe(
      map((user: any) => user.role === 'admin'),
      catchError((error: any) => {
        console.error('Error checking admin role:', error);
        return of(false);
      })
    );
  }

  accountExist(email: string): Observable<boolean> {
    return this.usersService.apiUsersGet().pipe(
      map((userList: any[]) => {
        return userList.some((user: any) => user.email === email);
      }),
      catchError((error: any) => {
        console.error('Error whith account:', error);
        return of(false);
      })
    );
  }

  getUserId(email: string): Observable<number> {
    return this.usersService.apiUsersGet().pipe(
      map((userList: any[]) => {
        const user = userList.find((user: any) => user.email === email);
        return user ? user.id : -1;
      }),
      catchError((error: any) => {
        console.error('Error to get the id :', error);
        return of(-1);
      })
    );
  }

  addUser(name: string, email: string, password: string): Observable<number> {
    return this.usersService
      .apiUsersPost({
        name: name,
        email: email,
        password: password,
        role: 'customer',
      })
      .pipe(
        map((response: any) => response.id),
        catchError((error: any) => {
          console.error('Error while adding user :', error);
          return of(-1);
        })
      );
  }

  changeEmail(email: string): Observable<any> {
    const body = { email: email };
    return this.usersService.apiUsersIdPut(body, this.idUser).pipe(
      catchError((error: any) => {
        console.error('Error while changing email :', error);
        return of(null);
      })
    );
  }

  changePassword(id: number, oldPassword: string, newPassword: string): Observable<any> {
    return this.usersService.apiUsersIdGet(id).pipe(
      map((user: any) => {
        if (user.password === oldPassword) {
          const body = { password: newPassword };
          return this.usersService.apiUsersIdPut(body, id).pipe(
            catchError((error: any) => {
              console.error('Error while changing the password :', error);
              return of(null);
            })
          );
        } else {
          console.error('Old password does not match');
          return of(null);
        }
      }),
      catchError((error: any) => {
        console.error('Error :', error);
        return of(null);
      })
    );
  }

  changeName(id: number, name: string): Observable<any> {
    const body = { name: name };
    return this.usersService.apiUsersIdPut(body, id).pipe(
      catchError((error: any) => {
        console.error('Error for the change of name :', error);
        return of(null);
      })
    );
  }

  login() {
    this.isAuthenticated = true;
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('id', this.idUser.toString());
  }

  logout() {
    this.isAuthenticated = false;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('id');
    localStorage.removeItem('cart');
  }
}

export interface userDTO {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "customer" | "admin";
}

export class UserModel {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: "customer" | "admin";

  constructor(src: userDTO) {
    this.id = src.id || -1;
    this.name = src.name || '';
    this.email = src.email || '';
    this.password = src.password || '';
    this.role = src.role || '';
  }
}
