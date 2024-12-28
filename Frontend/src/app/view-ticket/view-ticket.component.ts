import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NavBarComponent} from '../nav-bar/nav-bar.component';
import {DatePipe, NgClass, NgForOf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {HelpTicketsService} from '../api/help-tickets.service';
import {HelpTicketsResponsesService} from '../api/help-tickets-responses.service';
import {HelpTicketResponse} from '../../generated';


@Component({
  selector: 'app-view-ticket',
  standalone: true,
  imports: [
    NavBarComponent,
    NgForOf,
    NgClass,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './view-ticket.component.html',
  styleUrl: './view-ticket.component.css'
})
export class ViewTicketComponent implements AfterViewChecked, OnInit{
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

  // Go back to the help center
  helpCenter() {
    this.router.navigate(['/help']);
  }

  ngOnInit(): void {
    this.loadResponses();
  }

  // load the responses for the help ticket
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

  // scroll to the bottom of the chat box
  scrollToBottom(): void {
    try {
      this.messageBox.nativeElement.scrollTop = this.messageBox.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error while scrolling:', err);
    }
  }

  // send the response to the help ticket
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
