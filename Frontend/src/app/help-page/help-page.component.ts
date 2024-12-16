import { Component, OnInit } from '@angular/core';
import {NavBarComponent} from '../nav-bar/nav-bar.component';
import { HelpTicketsService, HelpTicketsResponsesService } from '../../generated';
import {NgForOf, NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [
    NavBarComponent,
    NgIf,
    NgForOf,
    ReactiveFormsModule,
  ],
  templateUrl: './help-page.component.html',
  styleUrl: './help-page.component.css'
})
export class HelpPageComponent implements OnInit{
  helpTickets: any[] = [];
  isModalOpen = false;
  createTicketForm: FormGroup;

  constructor(private router: Router,
              private authService: AuthService,
              private fb: FormBuilder,
              private helpTicketsService: HelpTicketsService) {

    this.createTicketForm = this.fb.group({
      subject: ['', Validators.required],
      description: ['', Validators.required],
    });
  }
  viewTicket(ticketId: number) {
    if (!ticketId) return;
    this.router.navigate(['/ticket/{id}', { id: ticketId }]);
  }

  ngOnInit(): void {
    this.loadHelpTickets();
  }

  private sortTicketsByStatus(tickets: any[]): any[] {
    const statusOrder = ['open', 'in_progress', 'resolved', 'closed'];

    return tickets.sort((a, b) => {
      const statusA = statusOrder.indexOf(a.status);
      const statusB = statusOrder.indexOf(b.status);

      return statusA - statusB;
    });
  }

  loadHelpTickets(): void {
    this.helpTicketsService.apiUsersUserIdHelpTicketsGet(this.authService.idUser).subscribe({
      next: (tickets) => { this.helpTickets = this.sortTicketsByStatus(tickets || []);
      },
      error: (err) => console.error('Error while loading the tickets :', err),
    });
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.createTicketForm.reset();
  }

  createTicket(): void {
    if (this.createTicketForm.invalid) return;

    const { subject, description } = this.createTicketForm.value;

    this.helpTicketsService
      .apiUsersUserIdHelpTicketsPost({ subject, description }, this.authService.idUser)
      .subscribe({
        next: (ticket) => {
          console.log('Ticket créé :', ticket);
          this.closeModal();
          this.loadHelpTickets();
        },
        error: (err) => console.error('Erreur lors de la création du ticket :', err),
      });
  }

  deleteTicket(ticketId: number): void {
    if (!ticketId) return;

    this.helpTicketsService.apiHelpTicketsIdDelete(ticketId).subscribe({
      next: () => {
        console.log(`Ticket ${ticketId} supprimé.`);
        this.loadHelpTickets();
      },
      error: (err) => {
        console.error(`Erreur lors de la suppression du ticket ${ticketId} :`, err);
      },
    });
  }

}
