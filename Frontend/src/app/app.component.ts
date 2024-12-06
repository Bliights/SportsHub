import { Component } from '@angular/core';
import { RouterOutlet} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {NavBarComponent} from './nav-bar/nav-bar.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'

})
export class AppComponent {
  title= "SportsHub";
}
