import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AdminNavBarComponent} from '../admin-nav-bar/admin-nav-bar.component';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {HelpTicket} from '../../generated';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HelpTicketsService} from '../api/help-tickets.service';
import {AllCommunityModule, ModuleRegistry} from 'ag-grid-community';
import {FormsModule, Validators} from '@angular/forms';
import {AgGridAngular} from 'ag-grid-angular';
ModuleRegistry.registerModules([AllCommunityModule]);


@Component({
  selector: 'app-admin-ticket-page',
  standalone: true,
  imports: [
    AdminNavBarComponent,
    DatePipe,
    NgIf,
    NgForOf,
    AgGridAngular,
    FormsModule
  ],
  templateUrl: './admin-ticket-page.component.html',
  styleUrl: './admin-ticket-page.component.css',
  providers: [DatePipe]
})
export class AdminTicketPageComponent implements OnInit{
  helpTickets: HelpTicket[] = [];
  paginatedHelpTickets: HelpTicket[] = [];
  @ViewChild('editModal', { static: true }) editModal!: TemplateRef<any>;
  selectedTicket: HelpTicket = {};


  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;


  constructor(private router: Router,
              private modalService: NgbModal,
              private datePipe: DatePipe,
              private helpTicketsService: HelpTicketsService) {

  }

  ngOnInit(): void {
    this.loadHelpTickets();
  }

  // Pagination Methods
  calculatePagination(): void {
    this.totalPages = Math.ceil(this.helpTickets.length / this.itemsPerPage);
    this.updatePaginatedProducts();
  }

  updatePaginatedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedHelpTickets = this.helpTickets.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedProducts();
  }

  // Load Help Tickets with sorting
  loadHelpTickets(): void {
    this.helpTicketsService.getHelpTickets().subscribe((tickets) => {
      this.helpTickets = tickets.sort((a, b) => {
        const statusOrder = ['open', 'in_progress', 'closed'];
        const statusComparison = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        if (statusComparison !== 0) {
          return statusComparison;
        }
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      });
      this.calculatePagination();
    });
  }

  // View Ticket
  viewTicket(ticketId: number): void {
    this.router.navigate([`/admin-tickets/${ticketId}`]);
  }

  // Delete Ticket
  deleteTicket(ticketId: number): void {
    this.helpTicketsService.deleteHelpTicket(ticketId).subscribe(() => {
      this.loadHelpTickets();
    });
  }

  // Edit Ticket
  editTicket(ticketId: number): void {
    const temp  = this.helpTickets.find(ticket => ticket.id === ticketId) || null;
    if (temp) {
      this.selectedTicket ={ ...temp}; // Copy the ticket to avoid imediate changes
      this.modalService.open(this.editModal, { size: 'lg', centered: true });
    }
  }
  // Save Changes of the ticket
  saveChanges(modal: any): void {
    if (!this.selectedTicket) {
      return;
    }

    this.helpTicketsService.updateHelpTicket(this.selectedTicket.id, this.selectedTicket.status).subscribe({
      next: () => {
        console.log('Ticket updated successfully');
        modal.dismiss();
        this.loadHelpTickets();
      },
      error: (err) => {
        console.error('Failed to update ticket:', err);
      }
    });
  }
}
