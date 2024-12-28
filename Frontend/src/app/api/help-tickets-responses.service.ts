import { inject, Injectable } from '@angular/core';
import {
  HelpTicketResponse,
  ResponsesUserIdBody,
  HelpTicketsResponsesService as SwaggerHelpTicketsResponsesService,
} from '../../generated';
import { map, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HelpTicketsResponsesService {

  constructor(private helpTicketsResponsesService: SwaggerHelpTicketsResponsesService) { }

  // Retrieve all responses for a specific help ticket
  getHelpTicketResponses(ticketId: number): Observable<HelpTicketResponse[]> {
    return this.helpTicketsResponsesService.apiHelpTicketsTicketIdResponsesGet(ticketId).pipe(
      map((response: HelpTicketResponse[]) => response),
      catchError((error) => {
        console.error(`Failed to fetch responses for help ticket with ID ${ticketId}:`, error);
        return throwError(() =>
          new Error(`Failed to fetch responses for help ticket with ID ${ticketId}.`)
        );
      })
    );
  }

  // Add a response to a specific help ticket
  addResponseToHelpTicket(ticketId: number, userId: number, response: string): Observable<HelpTicketResponse> {
    const body: ResponsesUserIdBody = {
      response: response,
    };

    return this.helpTicketsResponsesService.apiHelpTicketsTicketIdResponsesUserIdPost(body, ticketId, userId).pipe(
      map((response: HelpTicketResponse) => response),
      catchError((error) => {
        console.error(`Failed to add response for help ticket with ID ${ticketId}:`, error);
        return throwError(() =>
          new Error(`Failed to add response for help ticket with ID ${ticketId}.`)
        );
      })
    );
  }
}
