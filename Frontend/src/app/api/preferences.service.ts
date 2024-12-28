import { inject, Injectable } from '@angular/core';
import {
  Preference,
  UserIdPreferencesBody,
  PreferencesService as SwaggerPreferencesService,
} from '../../generated';
import { map, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PreferencesService {

  constructor(private preferencesService: SwaggerPreferencesService) {}

  // Retrieve preferences for a specific user
  getPreferences(userId: number): Observable<Preference> {
    return this.preferencesService.apiUsersUserIdPreferencesGet(userId).pipe(
      map((response: Preference) => response),
      catchError((error) => {
        console.error(`Failed to fetch preferences for user with ID ${userId}:`, error);
        return throwError(() =>
          new Error(`Failed to fetch preferences for user with ID ${userId}.`)
        );
      })
    );
  }

  // Update preferences for a specific user
  updatePreferences(userId: number, receiveNotification?: boolean, theme?: string, newsLetter?: boolean): Observable<Preference> {
    const preferences: UserIdPreferencesBody = {};

    // Conditionally add properties only if they are provided
    if (receiveNotification !== undefined) {
      preferences.receiveNotification = receiveNotification;
    }
    if (theme !== undefined) {
      preferences.theme = theme;
    }
    if (newsLetter !== undefined) {
      preferences.newsLetter = newsLetter;
    }

    return this.preferencesService.apiUsersUserIdPreferencesPut(preferences, userId).pipe(
      map((response: Preference) => response),
      catchError((error) => {
        console.error(`Failed to update preferences for user with ID ${userId}:`, error);
        return throwError(() =>
          new Error(`Failed to update preferences for user with ID ${userId}.`)
        );
      })
    );
  }
}
