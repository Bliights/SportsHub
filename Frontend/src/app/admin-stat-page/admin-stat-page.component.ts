import { Component } from '@angular/core';
import {AdminNavBarComponent} from '../admin-nav-bar/admin-nav-bar.component';
import {OrdersService} from '../api/orders.service';
import {ProductsService} from '../api/products.service';
import {HelpTicketsService} from '../api/help-tickets.service';
import {UsersService} from '../api/users.service';
import {HighchartsChartModule} from 'highcharts-angular';
import {NgIf} from '@angular/common';
import Highcharts from 'highcharts';

@Component({
  selector: 'app-admin-stat-page',
  standalone: true,
  imports: [
    AdminNavBarComponent,
    HighchartsChartModule,
    NgIf
  ],
  templateUrl: './admin-stat-page.component.html',
  styleUrl: './admin-stat-page.component.css'
})
export class AdminStatPageComponent {
  Highcharts: typeof Highcharts = Highcharts;
  orderChartOptions: Highcharts.Options = {};
  ticketChartOptions: Highcharts.Options = {};
  productChartOptions: Highcharts.Options = {};
  userChartOptions: Highcharts.Options = {};
  isLoading = true;


  constructor(private ordersService: OrdersService,
              private productService: ProductsService,
              private helpTicketService: HelpTicketsService,
              private usersService: UsersService) {

  }

  ngOnInit(): void {
    this.isLoading = true;

    // use promise because we need to wait for all data to be loaded, it's particularly useful
    // if we add a chart that need multiple async calls.
    Promise.all([
      this.loadOrderStats(),
      this.loadTicketStats(),
      this.loadProductStats(),
      this.loadUserStats()
    ])
      .then(() => {
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Error loading stats:', error);
        this.isLoading = false;
      });
  }

  // Load order stats
  loadOrderStats(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ordersService.getOrders().subscribe({
        next: (orders) => {
          const orderStatuses = orders.reduce((acc: Record<string, number>, order: any) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
          }, {});

          this.orderChartOptions = {
            chart: { type: 'pie' },
            title: { text: 'Order Status Distribution' },
            series: [
              {
                type: 'pie',
                name: 'Orders',
                data: Object.keys(orderStatuses).map((status) => ({
                  name: status,
                  y: orderStatuses[status]
                }))
              }
            ]
          };
          resolve();
        },
        error: (err) => {
          console.error('Failed to load order stats:', err);
          reject(err);
        }
      });
    });
  }

  // Load ticket stats
  loadTicketStats(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.helpTicketService.getHelpTickets().subscribe({
        next: (tickets: any) => {
          const ticketStatuses = tickets.reduce((acc: Record<string, number>, ticket: any) => {
            acc[ticket.status] = (acc[ticket.status] || 0) + 1;
            return acc;
          }, {});

          this.ticketChartOptions = {
            chart: { type: 'pie' },
            title: { text: 'Ticket Status Distribution' },
            series: [
              {
                type: 'pie',
                name: 'Tickets',
                data: Object.keys(ticketStatuses).map((status) => ({
                  name: status,
                  y: ticketStatuses[status]
                }))
              }
            ]
          };
          resolve();
        },
        error: (err: any) => {
          console.error('Failed to load ticket stats:', err);
          reject(err);
        }
      });
    });
  }

  // Load product stats
  loadProductStats(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.productService.getAllProducts().subscribe({
        next: (products) => {
          const productCategories = products.reduce((acc: Record<string, number>, product: any) => {
            acc[product.category] = (acc[product.category] || 0) + 1;
            return acc;
          }, {});

          this.productChartOptions = {
            chart: { type: 'pie' },
            title: { text: 'Product Category Distribution' },
            series: [
              {
                type: 'pie',
                name: 'Products',
                data: Object.keys(productCategories).map((category) => ({
                  name: category,
                  y: productCategories[category]
                }))
              }
            ]
          };
          resolve();
        },
        error: (err) => {
          console.error('Failed to load product stats:', err);
          reject(err);
        }
      });
    });
  }

  // Load user stats
  loadUserStats(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.usersService.getAllUsers().subscribe({
        next: (users) => {
          const userRoles = users.reduce((acc: Record<string, number>, user: any) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
          }, {});

          this.userChartOptions = {
            chart: { type: 'pie' },
            title: { text: 'User Role Distribution' },
            series: [
              {
                type: 'pie',
                name: 'Users',
                data: Object.keys(userRoles).map((role) => ({
                  name: role,
                  y: userRoles[role]
                }))
              }
            ]
          };
          resolve();
        },
        error: (err) => {
          console.error('Failed to load user stats:', err);
          reject(err);
        }
      });
    });
  }
}
