import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {HelpTicketResponse} from '../../generated';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {HelpTicketsService} from '../api/help-tickets.service';
import {HelpTicketsResponsesService} from '../api/help-tickets-responses.service';
import {DatePipe, NgClass, NgForOf} from '@angular/common';
import {AdminNavBarComponent} from '../admin-nav-bar/admin-nav-bar.component';

@Component({
  selector: 'app-admin-view-ticket',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    NgClass,
    AdminNavBarComponent
  ],
  templateUrl: './admin-view-ticket.component.html',
  styleUrl: './admin-view-ticket.component.css'
})
export class AdminViewTicketComponent implements AfterViewChecked, OnInit{
  responseForm: FormGroup;
  responses: HelpTicketResponse[] = [];
  ticketId: number = -1;
  @ViewChild('messageBox') private messageBox!: ElementRef;
  public userId: number = -1;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private helpTicketsService: HelpTicketsService,
              private helpTicketsResponsesService: HelpTicketsResponsesService) {

    this.responseForm = this.formBuilder.group({
      response: ['', [Validators.required]],
    });
  }

  // Navigate back to the admin tickets page
  home() {
    this.router.navigate(['/admin-tickets']);
  }

  ngOnInit(): void {
    this.loadResponses();
  }

  // Load all responses for the ticket
  loadResponses(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.ticketId = id ? parseInt(id, 10) : -1;
    this.userId = this.authService.userId;
    this.helpTicketsResponsesService.getHelpTicketResponses(this.ticketId).subscribe((response) => {
      this.responses = response;
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  // Scroll to the bottom of the message box
  scrollToBottom(): void {
    try {
      this.messageBox.nativeElement.scrollTop = this.messageBox.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error while scrolling:', err);
    }
  }

  // Put a response to the ticket
  sendResponse(): void {
    if (this.responseForm.valid) {
      const {response} = this.responseForm.value;
      this.helpTicketsResponsesService.addResponseToHelpTicket(this.ticketId, this.userId, response).subscribe(() => {
        this.loadResponses();
        this.responseForm.reset();
      });
    }
  }
}
