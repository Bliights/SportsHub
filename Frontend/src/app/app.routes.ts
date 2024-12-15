import { Routes } from '@angular/router';
import {SignUpComponent} from './sign-up/sign-up.component';
import {LoginComponent} from './login/login.component';
import {HomePageComponent} from './home-page/home-page.component';
import {EditAccountComponent} from './edit-account/edit-account.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { HelpPageComponent } from './help-page/help-page.component';
import { ViewTicketComponent } from './view-ticket/view-ticket.component';
import {ProductPageComponent} from './product-page/product-page.component';
import {UserOrdersComponent} from './user-orders/user-orders.component';
import {PreferencePageComponent} from './preference-page/preference-page.component';


export const routes: Routes = [
  {path:'sign-up', component: SignUpComponent},
  {path: 'login', component: LoginComponent},
  {path:'edit-account', component: EditAccountComponent},
  {path: 'cart', component: CartPageComponent},
  {path: 'help', component: HelpPageComponent},
  {path: 'ticket/:id', component: ViewTicketComponent},
  { path: 'user-orders', component: UserOrdersComponent },
  { path: 'product/:id', component: ProductPageComponent },
  {path:'preferences',component:PreferencePageComponent},
  {path: '', component: HomePageComponent}
];
