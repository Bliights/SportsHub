import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Product, Stock, Review, User} from '../../generated';
import {ProductsService} from '../api/products.service';
import {StocksService} from '../api/stocks.service';
import {CartItemsService} from '../api/cart-items.service';
import {OrdersService} from '../api/orders.service';
import {OrdersItemsService} from '../api/orders-items.service';
import {UsersService} from '../api/users.service';
import {ReviewsService} from '../api/reviews.service';
import {NavBarComponent} from '../nav-bar/nav-bar.component';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../auth.service';
import {forkJoin, map, of} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {catchError} from 'rxjs/operators';


@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [
    NavBarComponent,
    NgIf,
    FormsModule,
    NgForOf,
    DatePipe,
    NgClass,
    ReactiveFormsModule
  ],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css'
})
export class ProductPageComponent implements OnInit {
  productId: number = -1;
  product: Product = {};
  stocks: Stock[] = [];
  reviews: Review[] = [];
  users: User[] = [];
  size: string= '';
  quantity: number = 1;
  userCanReview: boolean = false;
  @ViewChild('createReviewModal', { static: true }) createReviewModal!: TemplateRef<any>;
  createReviewForm: FormGroup;
  selectedRating: number = 0;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private productsService: ProductsService,
              private stocksService: StocksService,
              private cartItemsService: CartItemsService,
              private reviewService: ReviewsService,
              private authService: AuthService,
              private ordersService: OrdersService,
              private ordersItemsService: OrdersItemsService,
              private usersService: UsersService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder) {
    this.createReviewForm = this.formBuilder.group({
      rating: [null, Validators.required],
      comment: [""],
    });
  }

  ngOnInit(): void {
    this.loadProduct();
    this.canReview();
  }

  // Load product and stock details
  loadProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productId = id ? parseInt(id, 10) : -1;

    //load product details
    this.productsService.getProductById(this.productId).subscribe((product) => {
      this.product = product;
    });

    //load stock details
    this.stocksService.getStockForProduct(this.productId).subscribe((stocks) => {
      this.stocks = stocks.filter(stock => stock.quantity > 0);
      if (stocks.length > 0) {
        this.size = stocks[0].size;
      }
    });

    //load reviews that have a comment and sort them by creation date
    this.reviewService.getReviewsForProduct(this.productId).subscribe((reviews) => {
      this.reviews = reviews
        .filter(review => review.comment)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });

    //load users
    this.usersService.getAllUsers().subscribe((users) => {
      this.users = users;
    });
  }

  // Get stock for selected size
  getStockForSelectedSize(): number {
    const stock = this.stocks.find((s) => s.size === this.size);
    return stock ? stock.quantity : 0;
  }

  // Quantity available for selected size
  validateQuantity(): void {
    const maxStock = this.getStockForSelectedSize();
    if (this.authService.isAuthenticated) {
      this.cartItemsService.getCartItems(this.authService.userId).subscribe(cartItems => {
        const cartItem = cartItems.find(item => item.productId === this.productId && item.size === this.size);
        const cartQuantity = cartItem ? cartItem.quantity : 0;
        const availableStock = maxStock - cartQuantity;

        if (this.quantity < 1) {
          this.quantity = 1;
        } else if (this.quantity > availableStock) {
          this.quantity = availableStock;
        }
      });
    } else {
      if (this.quantity < 1) {
        this.quantity = 1;
      } else if (this.quantity > maxStock) {
        this.quantity = maxStock;
      }
    }
  }

  // Navigate to home page
  goHome(): void {
    this.router.navigate(['/']);
  }

  // Add product to cart
  addToCart(): void {
    if (this.authService.isAuthenticated){
    const userId = this.authService.userId;
    this.cartItemsService.addCartItem(userId, this.productId, this.quantity, this.size).subscribe((item) => {
      console.log('Item successfully added to cart:', item);
      alert('Item successfully added to cart');
      this.router.navigate(['/']);
    });
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Enable review button
  canReview(): void {
    const userId = this.authService.userId;

    // Check if user has already reviewed this product
    this.reviewService.getReviewsForProduct(this.productId).pipe(
      catchError((error) => {
        console.error('Error fetching reviews:', error);
        return of([]); // Return empty array if error occurs to continue the process
      })
    ).subscribe((reviews) => {
      const hasReviewed = reviews.some((review) => review.userId === userId);

      if (hasReviewed) {
        this.userCanReview = false;
        return;
      }

      // Check if user has already ordered this product
      this.ordersService.getOrdersByUserId(userId).subscribe((orders) => {
        const orderObservables = orders.map((order) =>
          this.ordersItemsService.getOrderItems(order.id).pipe(
            map((orderItems) =>
              orderItems.some((orderItem) => orderItem.productId === this.productId)
            )
          )
        );

        forkJoin(orderObservables).subscribe((results) => {
          this.userCanReview = results.includes(true);
        });
      });
    });
  }

  // Get name of user
  getName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.name : 'Unknown';
  }

  // To generate the stars for each review
  generateStars(rating: number): string[] {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (rating >= i + 1) {
        stars.push("star");
      } else {
        stars.push("empty");
      }
    }
    return stars;
  }

  // Open create review modal
  openCreateReviewModal(): void {
    this.modalService.open(this.createReviewModal, { size: 'lg', centered: true });
  }

  // Close modal
  closeModal(modal: any): void {
    this.selectedRating = 0;
    this.createReviewForm.reset({
      rating: null,
      comment: "",
    });
    modal.dismiss()
  }

  // Star rating selection
  selectRating(rating: number): void {
    this.selectedRating = rating;
    this.createReviewForm.patchValue({ rating: rating });
    this.createReviewForm.get('rating')?.markAsTouched();
  }

  // To create a review
  createReview(modal: any) {
    if (this.createReviewForm.valid) {
      const reviewData = this.createReviewForm.value;
      const userId = this.authService.userId;

      this.reviewService.addReview(userId, this.product.id, reviewData.rating, reviewData.comment).subscribe((review) => {
        console.log('Review created successfully:', review);
        this.loadProduct();
        this.canReview();
      });

      modal.close();
    }
  }
}
