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
  }

  authSuccessful(email: string, password: string): Observable<boolean> {
    return this.usersService.apiUsersGet().pipe(
      map((userList: any[]) => {
        const user = userList.find(
          (user: any) => user.email === email && user.password === password
        );
        if (user) {
          this.idUser = user.id; // Enregistrer l'ID de l'utilisateur
          console.log(user, user.id, this.idUser);
          return true;
        }
        return false;
      }),
      catchError((error: any) => {
        console.error('Erreur lors de l\'authentification :', error);
        return of(false); // Retourne false en cas d'erreur
      })
    );
  }

  accountExist(email: string): Observable<boolean> {
    return this.usersService.apiUsersGet().pipe(
      map((userList: any[]) => {
        return userList.some((user: any) => user.email === email);
      }),
      catchError((error: any) => {
        console.error('Erreur lors de la vérification des comptes :', error);
        return of(false); // Retourne false en cas d'erreur
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
        console.error('Erreur lors de la récupération de l\'id :', error);
        return of(-1); // Retourne -1 en cas d'erreur
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
          console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
          return of(-1); // Retourne -1 en cas d'erreur
        })
      );
  }

  changeEmail(email: string): Observable<any> {
    const body = { email: email };
    return this.usersService.apiUsersIdPut(body, this.idUser).pipe(
      catchError((error: any) => {
        console.error('Erreur lors du changement d\'email :', error);
        return of(null); // Retourne null en cas d'erreur
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
              console.error('Erreur lors du changement de mot de passe :', error);
              return of(null); // Retourne null en cas d'erreur
            })
          );
        } else {
          console.error('L\'ancien mot de passe ne correspond pas');
          return of(null); // Retourne null si l'ancien mot de passe ne correspond pas
        }
      }),
      catchError((error: any) => {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
        return of(null); // Retourne null en cas d'erreur
      })
    );
  }

  changeName(id: number, name: string): Observable<any> {
    const body = { name: name };
    return this.usersService.apiUsersIdPut(body, id).pipe(
      catchError((error: any) => {
        console.error('Erreur lors du changement de nom :', error);
        return of(null); // Retourne null en cas d'erreur
      })
    );
  }

  login() {
    this.isAuthenticated = true;
    localStorage.setItem('isLoggedIn', 'true');
  }

  logout() {
    this.isAuthenticated = false;
    localStorage.removeItem('isLoggedIn');
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
