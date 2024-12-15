import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {PreferencesService, UserIdPreferencesBody} from '../../generated';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-preference-page',
  standalone: true,
  imports: [
    NavBarComponent,
    ReactiveFormsModule
  ],
  templateUrl: './preference-page.component.html',
  styleUrls: ['./preference-page.component.css']
})
export class PreferencePageComponent implements OnInit {
  preferenceForm: FormGroup;
  userId = localStorage.getItem('id');

  constructor(
    private preferencesService: PreferencesService,
    private fb: FormBuilder
  ) {
    this.preferenceForm = this.fb.group({
      receiveNotification: [false],
      theme: ['light'],
      newsLetter: [false]
    });
  }

  ngOnInit(): void {
    if (this.userId) {
      this.loadPreferences();
    } else {
      console.error('No user ID provided!');
    }
  }

  loadPreferences(): void {
    this.preferencesService.apiUsersUserIdPreferencesGet(this.userId).subscribe({
      next: (preference) => {
        this.preferenceForm.patchValue(preference);
      },
      error: (err) => {
        console.error('Failed to load preferences', err);
      }
    });
  }

  savePreferences(): void {
    let updatedPreference: UserIdPreferencesBody = {
      receiveNotification: this.preferenceForm.value.receiveNotification,
      theme: this.preferenceForm.value.theme,
      newsLetter: this.preferenceForm.value.newsLetter
    };

    this.preferencesService.apiUsersUserIdPreferencesPut(updatedPreference,this.userId).subscribe({
      next: (preference) => {
        console.log('Preferences updated successfully', preference);
      },
      error: (err) => {
        console.error('Failed to update preferences', err);
      }
    });
  }
}
