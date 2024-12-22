import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../generated';
import { AdminNavBarComponent } from '../admin-nav-bar/admin-nav-bar.component';
import { NgForOf, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColDef, ClientSideRowModelModule, Module } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  standalone: true,
  imports: [
    AdminNavBarComponent,
    NgForOf,
    NgIf,
    FormsModule,
    AgGridAngular
  ],
  styleUrls: ['./admin-orders.component.css'],
  providers: [DatePipe]
})
export class AdminOrdersComponent implements OnInit {
  public columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'userId', headerName: 'User ID' },
    {
      field: 'status',
      headerName: 'Status',
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['pending', 'shipped', 'delivered']
      }
    },
    {
      field: 'totalPrice',
      headerName: 'Total Price',
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      valueFormatter: (params: any) => {
        return this.datePipe.transform(params.value, 'short') || '';
      }
    },
    {
      field: 'closedAt',
      headerName: 'Closed At',
      valueFormatter: (params: any) => {
        return this.datePipe.transform(params.value, 'short') || '';
      }
    }
  ];

  public rowData: any[] = [];
  public modules: Module[] = [ClientSideRowModelModule];
  public selectedOrder: Order | null = null;

  constructor(private ordersService: OrdersService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.ordersService.apiOrdersGet().subscribe((orders: Order[]) => {
      this.rowData = orders;
    });
  }

  editOrder(order: Order): void {
    this.selectedOrder = { ...order };
  }

  updateOrder(): void {
    if (this.selectedOrder) {
      this.ordersService.apiOrdersIdPut(this.selectedOrder, this.selectedOrder.id).subscribe(() => {
        this.loadOrders();
        this.selectedOrder = null;
      });
    }
  }

  onCellValueChanged(event: any): void {
    const updatedOrder = event.data;
    this.ordersService.apiOrdersIdPut(updatedOrder, updatedOrder.id).subscribe(() => {
      console.log('Order updated successfully');
    });
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
