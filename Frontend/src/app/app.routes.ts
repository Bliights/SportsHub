import { Routes } from '@angular/router';
import {SignUpComponent} from './sign-up/sign-up.component';
import {LoginComponent} from './login/login.component';
import {HomePageComponent} from './home-page/home-page.component';
import {EditAccountComponent} from './edit-account/edit-account.component';

export const routes: Routes = [
  {path:'sign-up', component: SignUpComponent},
  {path: 'login', component: LoginComponent},
  {path:'edit-account', component: EditAccountComponent},
  {path: '', component: HomePageComponent}
];
