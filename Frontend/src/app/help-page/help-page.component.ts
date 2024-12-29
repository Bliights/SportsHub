import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NavBarComponent} from '../nav-bar/nav-bar.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {HelpTicket, Product, User} from '../../generated';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {HelpTicketsService} from '../api/help-tickets.service';
import {NgbModal, NgbToast} from '@ng-bootstrap/ng-bootstrap';
import {AllCommunityModule, ModuleRegistry} from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-help-page',
  standalone: true,
    imports: [
        NavBarComponent,
        ReactiveFormsModule,
        NgIf,
        NgForOf,
        DatePipe,
        NgbToast
    ],
  templateUrl: './help-page.component.html',
  styleUrl: './help-page.component.css',
  providers: [DatePipe]
})
export class HelpPageComponent implements OnInit{
  helpTickets: HelpTicket[] = [];
  paginatedHelpTickets: HelpTicket[] = [];
  createTicketForm: FormGroup;
  @ViewChild('createTicketModal', { static: true }) createTicketModal!: TemplateRef<any>;
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  toastMessage: string = '';
  toastHeader: string = '';
  show: boolean = false;


  constructor(private router: Router,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private datePipe: DatePipe,
              private helpTicketsService: HelpTicketsService) {

    this.createTicketForm = this.formBuilder.group({
      subject: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadHelpTickets();
    this.createTicketForm = this.formBuilder.group({
      subject: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  // Pagination methods
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


  //Load help tickets
  loadHelpTickets(): void {
    const userId = this.authService.userId;
    this.helpTicketsService.getHelpTicketsByUserId(userId).subscribe((tickets) => {
      this.helpTickets = tickets.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      this.calculatePagination();
    });

  }

  // View ticket
  viewTicket(ticketId: number): void {
    this.router.navigate([`/ticket/${ticketId}`]);
  }

  // Open the create ticket modal
  openCreateTicketModal(): void {
    this.modalService.open(this.createTicketModal, { size: 'lg', centered: true });
  }

  // Create a new ticket
  createTicket(modal: any): void {
    if (this.createTicketForm.invalid) {
      this.createTicketForm.markAllAsTouched();
      return;
    }

    const { subject, description } = this.createTicketForm.value;
    const userId = this.authService.userId;

    this.helpTicketsService.createHelpTicket(userId, subject, description).subscribe({
      next: () => {
        console.log('Help ticket created successfully');
        this.loadHelpTickets();
      },
      error: (err) => {
        console.error('Failed to create help ticket:', err);
      },
    });

    this.createTicketForm.reset({
      subject: '',
      description: '',
    });
    modal.dismiss();
    this.showToast('Help ticket created successfully', '');
  }

  // Delete a ticket
  deleteTicket(ticketId: number): void {
    this.helpTicketsService.deleteHelpTicket(ticketId).subscribe(() => {
      this.loadHelpTickets();
    });
    this.showToast('Help ticket deleted successfully', '');
  }

  // Show toast message
  showToast(message: string, header: string) {
    this.toastMessage = message;
    this.toastHeader = header || 'Notification';
    this.show = true; // Show the toast
  }

  // Hide toast message
  onToastHidden() {
    this.show = false;
  }
}
