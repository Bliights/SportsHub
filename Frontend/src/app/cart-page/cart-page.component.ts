import { Component, OnInit } from '@angular/core';
import {NavBarComponent} from '../nav-bar/nav-bar.component';
import {AuthService} from '../auth.service';
import {CartItem} from '../../generated';
import {CartItemsService} from '../api/cart-items.service';
import {ProductsService} from '../api/products.service';
import {OrdersService} from '../api/orders.service';
import {NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {AllCommunityModule, ColDef, ModuleRegistry} from 'ag-grid-community';
import {forkJoin, map} from 'rxjs';
import {AgGridAngular} from 'ag-grid-angular';
ModuleRegistry.registerModules([AllCommunityModule]);


export interface ExtendedCartItem extends CartItem {
  price?: number;
  name?: string;
}


@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    NavBarComponent,
    NgIf,
    AgGridAngular
  ],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent {
  cartItems: ExtendedCartItem[] = [];
  total: number = 0;

  columnDefs: ColDef[] = [
    { field: 'name', headerName: 'Product'},
    { field: 'size', headerName: 'Size' },
    { field: 'quantity',
      headerName: 'Quantity',
      editable: true,
      cellEditor: 'agNumberCellEditor',
    },
    { field: 'price', headerName: 'Price' },
    {
      headerName: 'Total',
      valueGetter: (params: any) => {
        return params.data.quantity * params.data.price;
      },
    },
    {
      headerName: 'Actions',
      filter: false,
      cellRenderer: (params: any) => {
        return `
        <button class="btn btn-danger btn-sm me-1">Delete</button>
      `;
      },
      onCellClicked: (params: any) => {
        const action = params.event.target.innerText;
        if (action === 'Delete') {
          this.deleteCartItem(params.data.id);
        }
      },
    },
  ];

  defaultColDef: ColDef = {filter: "agTextColumnFilter", floatingFilter: true,};
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50];
  public paginationPageSize = 10;

  constructor(private authService: AuthService,
              private cartItemsService: CartItemsService,
              private productsService: ProductsService,
              private ordersService: OrdersService,
              private router: Router,
  )
  {

  }

  ngOnInit(): void {
    this.loadCart();
  }

  // Delete a cart item
  deleteCartItem(cartItemId: number): void {
    const userId = this.authService.userId;

    this.cartItemsService.removeCartItem(userId, cartItemId).subscribe(() => {
      this.loadCart();
    });
  }

  // Update the quantity of a cart item
  onCellValueChanged(event: any): void {
    const cartItem = event.data;
    const userId = this.authService.userId;

    // If the quantity is less than 1, delete the cart item
    if (cartItem.quantity < 1) {
      this.deleteCartItem(cartItem.id);
      this.loadCart();
      return;
    }
    this.cartItemsService.updateCartItemQuantity(userId, cartItem.id, cartItem.quantity).subscribe({
      next: (updated) => {
        console.log('Cart updated successfully:', updated);
        this.loadCart();
      },
      error: (err) => {
        console.error('Failed to update cart:', err);
      },
    });
  }

  // Load the cart items
  loadCart(): void {
    const userId = this.authService.userId;

    this.cartItemsService.getCartItems(userId).subscribe((items) => {
      this.cartItems = items;
      const productObservables = this.cartItems.map((item) =>
        this.productsService.getProductById(item.productId).pipe(
          map((product: any) => {
            item.price = product.price;
            item.name = product.name;
            return item;
          })
        )
      );
      // Use forkJoin to wait because of multiple asyc calls
      forkJoin(productObservables).subscribe((updatedCartItems) => {
        this.cartItems = updatedCartItems;
        this.calculateTotal();
        console.log(this.cartItems);
      });
    });
  }

  // Calculate the total price of the cart
  calculateTotal(): void {
    this.total = this.cartItems.reduce((acc, cartItem) => {
      return acc + (cartItem.price || 0) * cartItem.quantity;
    }, 0);
    this.total = parseFloat(this.total.toFixed(2));
  }

  // Create an order from the cart items
  orderItems(): void {
    const userId = this.authService.userId;

    this.ordersService.createOrder(userId).subscribe((order) => {
      console.log('Order created successfully:', order);
      alert('Order created successfully');
      this.router.navigate(['/']);
    });
  }
}
