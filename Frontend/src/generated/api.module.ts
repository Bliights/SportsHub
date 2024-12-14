import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';


import { CartItemsService } from './api/cartItems.service';
import { HelpTicketsService } from './api/helpTickets.service';
import { HelpTicketsResponsesService } from './api/helpTicketsResponses.service';
import { OrdersService } from './api/orders.service';
import { OrdersItemsService } from './api/ordersItems.service';
import { PreferencesService } from './api/preferences.service';
import { ProductsService } from './api/products.service';
import { ReviewsService } from './api/reviews.service';
import { StocksService } from './api/stocks.service';
import { UsersService } from './api/users.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: [
    CartItemsService,
    HelpTicketsService,
    HelpTicketsResponsesService,
    OrdersService,
    OrdersItemsService,
    PreferencesService,
    ProductsService,
    ReviewsService,
    StocksService,
    UsersService ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
