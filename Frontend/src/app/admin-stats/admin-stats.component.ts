import { Component } from '@angular/core';
import {AdminNavBarComponent} from '../admin-nav-bar/admin-nav-bar.component';

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [
    AdminNavBarComponent
  ],
  templateUrl: './admin-stats.component.html',
  styleUrl: './admin-stats.component.css'
})
export class AdminStatsComponent {

}
