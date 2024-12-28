import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NavBarComponent} from '../nav-bar/nav-bar.component';
import {DatePipe, NgForOf} from '@angular/common';
import {OrdersService} from '../api/orders.service';
import {OrdersItemsService} from '../api/orders-items.service';
import {ProductsService} from '../api/products.service';
import {Order, OrderItem} from '../../generated';
import {AuthService} from '../auth.service';
import {AgGridAngular} from 'ag-grid-angular';
import {AllCommunityModule, ColDef, ModuleRegistry} from 'ag-grid-community';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {forkJoin, map} from 'rxjs';
ModuleRegistry.registerModules([AllCommunityModule]);

export interface ExtendedOrderItem extends OrderItem {
  productName?: string;
  brand?: string;
}



@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [
    NavBarComponent,
    NgForOf,
    AgGridAngular
  ],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.css',
  providers: [DatePipe]
})
export class OrdersPageComponent implements OnInit{
  orders: Order[] = [];
  orderItems: ExtendedOrderItem[] = [];

  selectedOrder: any = null;
  @ViewChild('orderModal', { static: true }) orderModal!: TemplateRef<any>;

  columnDefs: ColDef[] = [
    {headerName: 'Number',
      valueGetter: (params: any) => {
        return params.node ? params.node.rowIndex + 1 : null;
      },
    },
    {field: 'status', headerName: 'Status',},
    { field: 'totalPrice', headerName: 'Total Price' },
    {
      field: 'createdAt',
      headerName: 'Created At',
      valueFormatter: (params: any) => {
        return this.datePipe.transform(params.value, 'dd/MM/yyyy HH:mm', 'short') || '';
      }
    }
  ];

  orderColumnDefs: ColDef[] = [
    {headerName: 'Number',
      valueGetter: (params: any) => {
        return params.node ? params.node.rowIndex + 1 : null;
      },
    },
    { field: 'productName', headerName: 'Product Name' },
    { field: 'brand', headerName: 'Brand' },
    { field: 'quantity', headerName: 'Quantity' },
    { field: 'size', headerName: 'Size' },
    {
      headerName: 'Price',
      valueGetter: (params: any) => {
        return params.data.quantity * params.data.price;
      },
    },
  ]


  defaultColDef: ColDef = {filter: "agTextColumnFilter", floatingFilter: true,};
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50];
  public paginationPageSize = 10;

  constructor(
    private ordersService: OrdersService,
    private orderItemService: OrdersItemsService,
    private productService: ProductsService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // Load all orders
  loadOrders(): void {
    const userId = this.authService.userId;
    this.ordersService.getOrdersByUserId(userId).subscribe((orders) => {
      this.orders = orders;
    });
  }

  // Method to load order items
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

      // Use fork because of probleme with asychronous calls
      forkJoin(productObservables).subscribe((updatedOrderItems) => {
        this.orderItems = updatedOrderItems;
        console.log(this.orderItems);
      });
    });
  }

  // Method to view orders detail in modal
  viewOrders(event: any){
    this.selectedOrder = event.data;
    this.loadOrderItems(this.selectedOrder.id)
    this.modalService.open(this.orderModal, { size: 'xl' });
  }
}
