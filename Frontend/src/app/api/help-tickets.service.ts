import { inject, Injectable } from '@angular/core';
import {
  HelpTicket, HelpticketsIdBody,
  HelpTicketsService as SwaggerHelpTicketsService, UserIdHelpticketsBody,
} from '../../generated';
import {map, Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HelpTicketsService {

  constructor(private helpTicketsService: SwaggerHelpTicketsService) {}

  // Retrieve all help tickets
  getHelpTickets(): Observable<HelpTicket[]> {
    return this.helpTicketsService.apiHelpTicketsGet().pipe(
      map((response: HelpTicket[]) => response),
      catchError((error) => {
        console.error('Failed to fetch help tickets:', error);
        return throwError(() => new Error('Failed to fetch help tickets.'));
      })
    );
  }

  // Retrieve details of a specific help ticket
  getHelpTicketById(id: number): Observable<HelpTicket> {
    return this.helpTicketsService.apiHelpTicketsIdGet(id).pipe(
      map((response: HelpTicket) => response),
      catchError((error) => {
        console.error(`Failed to fetch help ticket with ID ${id}:`, error);
        return throwError(() =>
          new Error(`Failed to fetch help ticket with ID ${id}.`)
        );
      })
    );
  }

  // Create a new help ticket for a specific user
  createHelpTicket(userId: number, subject: string, description: string): Observable<HelpTicket> {
    const body: UserIdHelpticketsBody = {
      subject: subject,
      description: description
    };

    return this.helpTicketsService.apiUsersUserIdHelpTicketsPost(body, userId).pipe(
      map((response: HelpTicket) => response),
      catchError((error) => {
        console.error(`Failed to create help ticket for user ID ${userId}:`, error);
        return throwError(() =>
          new Error('Failed to create help ticket.')
        );
      })
    );
  }

  // Fetch all help tickets for a specific user
  getHelpTicketsByUserId(userId: number): Observable<HelpTicket[]> {
    return this.helpTicketsService.apiUsersUserIdHelpTicketsGet(userId).pipe(
      map((response: HelpTicket[]) => response),
      catchError((error) => {
        console.error(`Failed to fetch help tickets for user ID ${userId}:`, error);
        return throwError(() =>
          new Error(`Failed to fetch help tickets for user ID ${userId}.`)
        );
      })
    );
  }

  // Update an existing help ticket (e.g., update status)
  updateHelpTicket(id: number, status: string): Observable<HelpTicket> {
    const body: HelpticketsIdBody = {
      status: status
    };

    return this.helpTicketsService.apiHelpTicketsIdPut(body, id).pipe(
      map((response: HelpTicket) => response),
      catchError((error) => {
        console.error(`Failed to update help ticket with ID ${id}:`, error);
        return throwError(() =>
          new Error(`Failed to update help ticket with ID ${id}.`)
        );
      })
    );
  }

  // Delete a help ticket
  deleteHelpTicket(id: number): Observable<void> {
    return this.helpTicketsService.apiHelpTicketsIdDelete(id).pipe(
      map(() => undefined),
      catchError((error) => {
        console.error(`Failed to delete help ticket with ID ${id}:`, error);
        return throwError(() => new Error(`Failed to delete help ticket with ID ${id}.`));
      })
    );
  }

}
