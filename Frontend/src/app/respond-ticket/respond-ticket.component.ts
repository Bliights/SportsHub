import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HelpTicketsService, HelpTicketsResponsesService } from '../../generated';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, NgClass, NgForOf } from '@angular/common';
import { AdminNavBarComponent } from '../admin-nav-bar/admin-nav-bar.component';
import {NavBarComponent} from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-respond-ticket',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    ReactiveFormsModule,
    DatePipe,
    AdminNavBarComponent,
    NavBarComponent
  ],
  templateUrl: './respond-ticket.component.html',
  styleUrls: ['./respond-ticket.component.css']
})
export class RespondTicketComponent implements AfterViewChecked, OnInit {
  ticketId: number = -1;
  responses: any[] = [];
  public idUser: number = -1;
  @ViewChild('messageBox') private messageBox!: ElementRef;
  responseForm: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private helpTicketsService: HelpTicketsService,
              private helpTicketsResponsesService: HelpTicketsResponsesService) {

    const id = localStorage.getItem('id');
    this.idUser = id ? parseInt(id, 10) : -1;
    this.responseForm = this.fb.group({
      response: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.ticketId = id ? parseInt(id, 10) : -1;

    if (this.ticketId !== -1) {
      this.loadResponses();
    } else {
      console.error('Invalid ticket ID');
    }
  }

  loadResponses(): void {
    this.helpTicketsResponsesService
      .apiHelpTicketsTicketIdResponsesGet(this.ticketId)
      .subscribe({
        next: (data) => {
          this.responses = data || [];
          console.log('Responses loaded:', this.responses);
        },
        error: (err) => console.error('Error loading responses:', err),
      });
  }

  scrollToBottom(): void {
    try {
      this.messageBox.nativeElement.scrollTop = this.messageBox.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error while scrolling:', err);
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendResponse(): void {
    if (this.responseForm.invalid) return;

    const { response } = this.responseForm.value;

    this.helpTicketsResponsesService
      .apiHelpTicketsTicketIdResponsesUserIdPost(
        { response },
        this.ticketId,
        this.idUser
      )
      .subscribe({
        next: () => {
          console.log('Response sent successfully');
          this.loadResponses();
          this.responseForm.reset();
        },
        error: (err) => {
          console.error('Error sending response:', err);
        },
      });
  }

  helpCenter(): void {
    this.router.navigate(['/admin-tickets']);
  }
}
