import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../generated';
import { AdminNavBarComponent } from '../admin-nav-bar/admin-nav-bar.component';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  standalone: true,
  imports: [
    AdminNavBarComponent,
    NgForOf,
    NgIf,
    FormsModule
  ],
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  editedOrder: Order | null = null;

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.ordersService.apiOrdersGet().subscribe((orders: Order[]) => {
      this.orders = orders;
    });
  }

  editOrder(order: Order): void {
    this.editedOrder = { ...order };
  }

  saveOrder(): void {
    if (this.editedOrder) {
      this.ordersService.apiOrdersIdPut(this.editedOrder,this.editedOrder.id).subscribe(() => {
        this.loadOrders();
        this.editedOrder = null;
      });
    }
  }

  cancelEdit(): void {
    this.editedOrder = null;
  }
}
class Order{
  public id!: number;
  public userId!: number;
  public status!: "pending" | "shipped" | "delivered";
  public totalPrice!: number;
  public createdAt!: Date;
  public closedAt!: Date | null;
}
