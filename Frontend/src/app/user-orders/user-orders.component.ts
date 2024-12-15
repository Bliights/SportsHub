import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../generated'; // Vérifiez le bon chemin
import { ActivatedRoute } from '@angular/router';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {NavBarComponent} from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NavBarComponent,
    DatePipe
  ],
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent implements OnInit {
  orders: any[] = [];
  userId = localStorage.getItem('id');
  selectedOrder: any;

  constructor(
    private ordersService: OrdersService,
    private route: ActivatedRoute // Pour récupérer le userId
  ) {}

  ngOnInit(): void {
    if (this.userId) {
      this.loadOrders();
    } else {
      console.error('No user ID provided!');
    }
  }

  loadOrders(): void {
    this.ordersService.apiUsersUserIdOrdersGet(this.userId).subscribe({
      next: (data) => {
        this.orders = data; // Remplir la liste des commandes
      },
      error: (err) => {
        console.error('Failed to load orders', err);
      }
    });
  }

}
