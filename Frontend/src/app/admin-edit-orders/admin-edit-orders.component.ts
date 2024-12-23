import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../generated';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { AdminNavBarComponent } from '../admin-nav-bar/admin-nav-bar.component';

@Component({
  selector: 'app-admin-edit-orders',
  templateUrl: './admin-edit-orders.component.html',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    NgForOf,
    AdminNavBarComponent,
    DatePipe
  ],
  styleUrls: ['./admin-edit-orders.component.css']
})
export class AdminEditOrdersComponent implements OnInit {
  orders: Order[] = [];
  orderForm: FormGroup;
  selectedOrder: Order | null = null;

  constructor(private ordersService: OrdersService, private formBuilder: FormBuilder) {
    this.orderForm = this.formBuilder.group({
      id: [''],
      userId: ['', Validators.required],
      status: ['', Validators.required],
      totalPrice: ['', [Validators.required, Validators.min(0)]],
      createdAt: ['', Validators.required],
      closedAt: ['']
    });

    this.orderForm.get('status')?.valueChanges.subscribe(value => {
      if (value === 'delivered') {
        this.orderForm.get('closedAt')?.setValue(new Date().toISOString().split('T')[0]);
      }
    });
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.ordersService.apiOrdersGet().subscribe((data: Order[]) => {
      this.orders = data;
    });
  }

  editOrder(order: Order) {
    this.selectedOrder = order;
    this.orderForm.setValue({
      id: order.id,
      userId: order.userId,
      status: order.status,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
      closedAt: order.closedAt ? new Date(order.closedAt):""
    });
  }

  updateOrder() {
    if (this.orderForm.valid) {
      this.ordersService.apiOrdersIdPut(this.orderForm.value, this.orderForm.value.id).subscribe(() => {
        console.log(this.orderForm.value);
        this.loadOrders();
        this.orderForm.reset();
        this.selectedOrder = null;
      });
    }
  }
}

export class Order {
  public id!: number;
  public userId!: number;
  public status!: "pending" | "shipped" | "delivered";
  public totalPrice!: number;
  public createdAt!: Date;
  public closedAt!: Date | null;
}
