import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {PreferencesService} from '../api/preferences.service';
import {Preference} from '../../generated';
import {AuthService} from '../auth.service';
import {NavBarComponent} from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-preference-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NavBarComponent
  ],
  templateUrl: './preference-page.component.html',
  styleUrl: './preference-page.component.css'
})
export class PreferencePageComponent implements OnInit {
  preferenceForm: FormGroup;
  preference: Preference = {};

  constructor(private preferencesService: PreferencesService, private formBuilder: FormBuilder, private authService: AuthService) {
    this.preferenceForm = this.formBuilder.group({
      receiveNotification: [false],
      theme: ['light'],
      newsLetter: [false]
    });
  }

  ngOnInit(): void {
    this.loadPreferences();
    this.setupFormListeners();
  }

  // Load the user's preferences
  loadPreferences(): void {
    const userId = this.authService.userId;
    this.preferencesService.getPreferences(userId).subscribe((preference) => {
      this.preference = preference;
      this.preferenceForm.patchValue(preference);
    });
  }

  // Setup listeners for form changes
  setupFormListeners(): void {
    const userId = this.authService.userId;

    this.preferenceForm.get('receiveNotification')?.valueChanges.subscribe((value: boolean) => {
      this.preferencesService.updatePreferences(userId, value, undefined, undefined).subscribe({
        next: () => console.log(`Updated receiveNotification to ${value}`),
        error: (err) => console.error('Error updating receiveNotification:', err),
      });
    });

    this.preferenceForm.get('theme')?.valueChanges.subscribe((value: string) => {
      this.preferencesService.updatePreferences(userId, undefined, value, undefined).subscribe({
        next: () => console.log(`Updated theme to ${value}`),
        error: (err) => console.error('Error updating theme:', err),
      });
    });

    this.preferenceForm.get('newsLetter')?.valueChanges.subscribe((value: boolean) => {
      this.preferencesService.updatePreferences(userId, undefined, undefined, value).subscribe({
        next: () => console.log(`Updated newsLetter to ${value}`),
        error: (err) => console.error('Error updating newsLetter:', err),
      });
    });
  }
}
