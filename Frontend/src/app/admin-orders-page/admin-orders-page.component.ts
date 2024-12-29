import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {OrdersService} from '../api/orders.service';
import {Order, OrderItem} from '../../generated';
import {AdminNavBarComponent} from '../admin-nav-bar/admin-nav-bar.component';
import {AgGridAngular} from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  ISelectCellEditorParams,
  ModuleRegistry,
} from 'ag-grid-community';
import {DatePipe} from '@angular/common';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {OrdersItemsService} from '../api/orders-items.service';
import {ProductsService} from '../api/products.service';
import {forkJoin, map} from 'rxjs';
ModuleRegistry.registerModules([AllCommunityModule]);

export interface ExtendedOrderItem extends OrderItem {
  productName?: string;
  brand?: string;
}


@Component({
  selector: 'app-admin-orders-page',
  standalone: true,
  imports: [
    AdminNavBarComponent,
    AgGridAngular
  ],
  templateUrl: './admin-orders-page.component.html',
  styleUrl: './admin-orders-page.component.css',
  providers: [DatePipe]
})
export class AdminOrdersPageComponent implements OnInit{
  orders: Order[] = [];
  orderItems: ExtendedOrderItem[] = [];

  selectedOrder: any = null;
  @ViewChild('orderModal', { static: true }) orderModal!: TemplateRef<any>;


  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'userId', headerName: 'User ID' },
    {field: 'status',
      headerName: 'Status',
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['pending', 'shipped', 'delivered']
      } as ISelectCellEditorParams
    },
    { field: 'totalPrice', headerName: 'Total Price' },
    {
      field: 'createdAt',
      headerName: 'Created At',
      valueFormatter: (params: any) => {
        return this.datePipe.transform(params.value, 'dd/MM/yyyy HH:mm', 'short') || '';
      }
    },
    {
      field: 'closedAt',
      headerName: 'Closed At',
      valueFormatter: (params: any) => {
        return this.datePipe.transform(params.value, 'dd/MM/yyyy HH:mm', 'short') || '';
      }
    }
  ];

  orderColumnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID'},
    { field: 'productName', headerName: 'Product Name' },
    { field: 'brand', headerName: 'Brand' },
    { field: 'quantity', headerName: 'Quantity' },
    { field: 'size', headerName: 'Size' },
    {
      headerName: 'Price',
      valueGetter: (params: any) => {
        return parseFloat((params.data.quantity * params.data.price).toFixed(2));
      },
    },
  ]

  defaultColDef: ColDef = {filter: "agTextColumnFilter", floatingFilter: true,};
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50];
  public paginationPageSize = 10;

  constructor(private ordersService: OrdersService,
              private datePipe: DatePipe,
              private modalService: NgbModal,
              private orderItemService: OrdersItemsService,
              private productService: ProductsService,
              ) {

  }

  ngOnInit(): void {
    this.loadOrders();
  }

  // Load orders
  loadOrders(): void {
    this.ordersService.getOrders().subscribe((orders: Order[]) => {
      this.orders = orders;
    });
  }

  // Update order status
  onOrderChanged(event: any): void {
    const updatedOrder = event.data;

    this.ordersService.updateOrder(updatedOrder.id,updatedOrder.status).subscribe({
      next: (updated) => {
        console.log('Order updated successfully:', updated);
        this.loadOrders();
      },
      error: (err) => {
        console.error('Failed to update order:', err);
      },
    });
  }

  // Load order items
  loadOrderItems(orderId: number): void {
    this.orderItemService.getOrderItems(orderId).subscribe((orderItems: OrderItem[]) => {
      const extendedOrderItems: ExtendedOrderItem[] = orderItems.map(item => ({ ...item }));

      const productObservables = extendedOrderItems.map((item) =>
        this.productService.getProductById(item.productId).pipe(
          map((product) => {
            item.productName = product.name;
            item.brand = product.brand;
            return item;
          })
        )
      );

      // Use fork because of pb with asychronous calls we need to wait for all calls to finish
      forkJoin(productObservables).subscribe((updatedOrderItems) => {
        this.orderItems = updatedOrderItems;
        console.log(this.orderItems);
      });
    });
  }

  // View orders
  viewOrders(event: any){
    // Prevent opening modal when clicking on status column
    if (event.colDef?.field === 'status') {
      return;
    }
    this.selectedOrder = event.data;
    this.loadOrderItems(this.selectedOrder.id)
    this.modalService.open(this.orderModal, { size: 'xl' });
  }
}
