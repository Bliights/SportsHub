import { Routes } from '@angular/router';
import {HomePageComponent} from './home-page/home-page.component';
import {LoginPageComponent} from './login-page/login-page.component';
import {SignUpPageComponent} from './sign-up-page/sign-up-page.component';
import {CartPageComponent} from './cart-page/cart-page.component';
import {EditAccountPageComponent} from './edit-account-page/edit-account-page.component';
import {HelpPageComponent} from './help-page/help-page.component';
import {ViewTicketComponent} from './view-ticket/view-ticket.component';
import {PreferencePageComponent} from './preference-page/preference-page.component';
import {OrdersPageComponent} from './orders-page/orders-page.component';
import {ProductPageComponent} from './product-page/product-page.component';
import {AdminOrdersPageComponent} from './admin-orders-page/admin-orders-page.component';
import {AdminInventoryPageComponent} from './admin-inventory-page/admin-inventory-page.component';
import {AdminTicketPageComponent} from './admin-ticket-page/admin-ticket-page.component';
import {AdminViewTicketComponent} from './admin-view-ticket/admin-view-ticket.component';
import {AdminUserPageComponent} from './admin-user-page/admin-user-page.component';
import {AdminStatPageComponent} from './admin-stat-page/admin-stat-page.component';


export const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'login', component: LoginPageComponent},
  {path:'sign-up', component: SignUpPageComponent},
  {path: 'cart', component: CartPageComponent},
  {path: 'edit-account', component: EditAccountPageComponent},
  {path: 'help', component: HelpPageComponent},
  {path: 'ticket/:id', component: ViewTicketComponent},
  {path: 'preferences',component: PreferencePageComponent},
  {path: 'orders', component: OrdersPageComponent },
  {path: 'product/:id', component: ProductPageComponent },
  {path:'admin-orders',component: AdminOrdersPageComponent},
  {path:'admin-inventory',component: AdminInventoryPageComponent},
  {path:'admin-tickets',component: AdminTicketPageComponent},
  {path: 'admin-tickets/:id', component: AdminViewTicketComponent},
  {path: 'admin-users-management', component: AdminUserPageComponent},
  {path: 'admin-stats', component: AdminStatPageComponent},
];
