import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {SignUpPackage} from './sign-up/sign-up.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  public isAuthenticated: boolean = false;
  public idUser: number = -1;

  constructor() {
  }

  authSuccessful(email: string, password: string): Observable<boolean> {
    return this.httpClient.get<userDTO[]>('/api/users').pipe(
      map((userList: userDTO[]) => {
        return userList.some((user: userDTO) => user.email === email && user.password === password);
      }),
      catchError((error: any) => {
        console.error('Erreur lors de l\'authentification :', error);
        return of(false); // Retourne false en cas d'erreur
      })
    );
  }

  accountExist(email: string): Observable<boolean> {
    return this.httpClient.get<userDTO[]>('/api/users').pipe(
      map((userList: userDTO[]) => {
        return userList.some((user: userDTO) => user.email === email);
      }),
      catchError((error: any) => {
        console.error('Erreur lors de la vérification des comptes :', error);
        return of(false); // Retourne false en cas d'erreur
      })
    );
  }

  getUserId(email: string): Observable<number> {
    return this.httpClient.get<userDTO[]>('/api/users').pipe(
      map((userList: userDTO[]) => {
        const userDTO = userList.find((user: userDTO) => user.email === email);
        return userDTO ? userDTO.id : -1;
      }),
      catchError((error: any) => {
        console.error('Erreur lors de la récupération de l\'id :', error);
        return of(-1); // Retourne -1 en cas d'erreur
      })
    );
  }

  addUser(name: string, email: string, password: string): Observable<number> {
    return this.httpClient.post<{ id: number }>('/api/users', {name:name, email:email, password:password, role: 'customer'}).pipe(
      map(response => response.id),
      catchError((error: any) => {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
        return of(-1); // Retourne -1 en cas d'erreur
      })
    );
  }

  changeEmail(email: string): Observable<any> {
    const body = { email: email };
    return this.httpClient.put(`/api/users/${this.idUser}`, body).pipe(
      catchError((error: any) => {
        console.error('Error changing email:', error);
        return of(null); // Return null in case of error
      })
    );
  }

  changePassword(id: number, oldPassword: string, newPassword: string): Observable<any> {
    return this.httpClient.get<userDTO>(`/api/users/${id}`).pipe(
      map((user: userDTO) => {
        if (user.password === oldPassword) {
          const body = { password: newPassword };
          return this.httpClient.put(`/api/users/${id}`, body).pipe(
            catchError((error: any) => {
              console.error('Error changing password:', error);
              return of(null); // Return null in case of error
            })
          );
        } else {
          console.error('Old password does not match');
          return of(null); // Return null if old password does not match
        }
      }),
      catchError((error: any) => {
        console.error('Error fetching user data:', error);
        return of(null); // Return null in case of error
      })
    );
  }

  changeName(id: number, name: string): Observable<any> {
    const body = { name: name };
    return this.httpClient.put(`/api/users/${id}`, body).pipe(
      catchError((error: any) => {
        console.error('Error changing name:', error);
        return of(null); // Return null in case of error
      })
    );
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
