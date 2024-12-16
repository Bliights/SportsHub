import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelpTicketsService } from '../../generated';
import { AdminNavBarComponent } from '../admin-nav-bar/admin-nav-bar.component';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-ticket',
  templateUrl: './admin-ticket.component.html',
  standalone: true,
  imports: [
    AdminNavBarComponent,
    NgForOf,
    NgIf,
    FormsModule
  ],
  styleUrls: ['./admin-ticket.component.css']
})
export class AdminTicketComponent implements OnInit {
  tickets: Ticket[] = [];
  editedTicket: Ticket | null = null;

  constructor(private ticketsService: HelpTicketsService, private router: Router) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.ticketsService.apiHelpTicketsGet().subscribe((tickets: Ticket[]) => {
      this.tickets = tickets;
    });
  }

  editTicket(ticket: Ticket): void {
    this.editedTicket = { ...ticket };
  }

  saveTicket(): void {
    if (this.editedTicket) {
      this.ticketsService.apiHelpTicketsIdPut(this.editedTicket, this.editedTicket.id).subscribe(() => {
        this.loadTickets();
        this.editedTicket = null;
      });
    }
  }

  cancelEdit(): void {
    this.editedTicket = null;
  }

  viewTicket(ticketId: number) {
    if (!ticketId) return;
    this.router.navigate(['/ticket-response/{id}', { id: ticketId }]);
  }

}

class Ticket {
  public id!: number;
  public userId!: number;
  public status!: string;
  public description!: string;
  public createdAt!: Date;
  public updatedAt!: Date | null;
}
