import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { OrdersService, HelpTicketsService, ProductsService, UsersService } from '../../generated';
import { AdminNavBarComponent } from '../admin-nav-bar/admin-nav-bar.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-stats',
  templateUrl: './admin-stats.component.html',
  standalone: true,
  imports: [
    AdminNavBarComponent,
    HighchartsChartModule,
    NgIf
  ],
  styleUrls: ['./admin-stats.component.css']
})
export class AdminStatsComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  orderChartOptions: Highcharts.Options = {};
  ticketChartOptions: Highcharts.Options = {};
  productChartOptions: Highcharts.Options = {};
  userChartOptions: Highcharts.Options = {};
  isLoading = true; // Indicateur de chargement

  constructor(
    private ordersService: OrdersService,
    private ticketsService: HelpTicketsService,
    private productsService: ProductsService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.loadOrderStats();
    this.loadTicketStats();
    this.loadProductStats();
    this.loadUserStats();
  }

  loadOrderStats(): void {
    this.ordersService.apiOrdersGet().subscribe({
      next: (orders) => {
        const orderStatuses = orders.reduce((acc: Record<string, number>, order: any) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {});

        this.orderChartOptions = {
          chart: {
            type: 'pie'
          },
          title: {
            text: 'Order Status Distribution'
          },
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
        this.isLoading = false; // Fin du chargement
      },
      error: (err) => {
        console.error('Failed to load order stats:', err);
        this.isLoading = false; // Fin du chargement malgré l'erreur
      }
    });
  }

  loadTicketStats(): void {
    this.ticketsService.apiHelpTicketsGet().subscribe({
      next: (tickets:any) => {
        const ticketStatuses = tickets.reduce((acc: Record<string, number>, ticket: any) => {
          acc[ticket.status] = (acc[ticket.status] || 0) + 1;
          return acc;
        }, {});

        this.ticketChartOptions = {
          chart: {
            type: 'pie'
          },
          title: {
            text: 'Ticket Status Distribution'
          },
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
        this.isLoading = false; // Fin du chargement
      },
      error: (err:any) => {
        console.error('Failed to load ticket stats:', err);
        this.isLoading = false; // Fin du chargement malgré l'erreur
      }
    });
  }

  loadProductStats(): void {
    this.productsService.apiProductsGet().subscribe({
      next: (products) => {
        const productCategories = products.reduce((acc: Record<string, number>, product: any) => {
          acc[product.category] = (acc[product.category] || 0) + 1;
          return acc;
        }, {});

        this.productChartOptions = {
          chart: {
            type: 'pie'
          },
          title: {
            text: 'Product Category Distribution'
          },
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
        this.isLoading = false; // Fin du chargement
      },
      error: (err) => {
        console.error('Failed to load product stats:', err);
        this.isLoading = false; // Fin du chargement malgré l'erreur
      }
    });
  }

  loadUserStats(): void {
    this.usersService.apiUsersGet().subscribe({
      next: (users) => {
        const userRoles = users.reduce((acc: Record<string, number>, user: any) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {});

        this.userChartOptions = {
          chart: {
            type: 'pie'
          },
          title: {
            text: 'User Role Distribution'
          },
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
        this.isLoading = false; // Fin du chargement
      },
      error: (err) => {
        console.error('Failed to load user stats:', err);
        this.isLoading = false; // Fin du chargement malgré l'erreur
      }
    });
  }
}
