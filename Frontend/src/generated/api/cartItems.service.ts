/**
 * SportsHub
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *//* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs';

import { CartProductIdBody } from '../model/cartProductIdBody';
import { InlineResponse201 } from '../model/inlineResponse201';
import { UserIdCartBody } from '../model/userIdCartBody';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class CartItemsService {

    protected basePath = 'http://localhost:3000';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     * Get all items in a user&#x27;s cart
     * Retrieve all items currently in a specific user&#x27;s cart.
     * @param userId Unique identifier of the user.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiUsersUserIdCartGet(userId: any, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public apiUsersUserIdCartGet(userId: any, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public apiUsersUserIdCartGet(userId: any, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public apiUsersUserIdCartGet(userId: any, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (userId === null || userId === undefined) {
            throw new Error('Required parameter userId was null or undefined when calling apiUsersUserIdCartGet.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<any>('get',`${this.basePath}/api/users/${encodeURIComponent(String(userId))}/cart`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Add an item to a user&#x27;s cart
     * Add a new item to the cart for a specific user.
     * @param body 
     * @param userId Unique identifier of the user.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiUsersUserIdCartPost(body: UserIdCartBody, userId: any, observe?: 'body', reportProgress?: boolean): Observable<InlineResponse201>;
    public apiUsersUserIdCartPost(body: UserIdCartBody, userId: any, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<InlineResponse201>>;
    public apiUsersUserIdCartPost(body: UserIdCartBody, userId: any, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<InlineResponse201>>;
    public apiUsersUserIdCartPost(body: UserIdCartBody, userId: any, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling apiUsersUserIdCartPost.');
        }

        if (userId === null || userId === undefined) {
            throw new Error('Required parameter userId was null or undefined when calling apiUsersUserIdCartPost.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<InlineResponse201>('post',`${this.basePath}/api/users/${encodeURIComponent(String(userId))}/cart`,
            {
                body: body,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Remove an item from a user&#x27;s cart
     * Delete a specific product from a user&#x27;s cart using its product ID.
     * @param userId Unique identifier of the user.
     * @param productId Unique identifier of the product to delete from the cart.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiUsersUserIdCartProductIdDelete(userId: any, productId: any, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public apiUsersUserIdCartProductIdDelete(userId: any, productId: any, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public apiUsersUserIdCartProductIdDelete(userId: any, productId: any, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public apiUsersUserIdCartProductIdDelete(userId: any, productId: any, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (userId === null || userId === undefined) {
            throw new Error('Required parameter userId was null or undefined when calling apiUsersUserIdCartProductIdDelete.');
        }

        if (productId === null || productId === undefined) {
            throw new Error('Required parameter productId was null or undefined when calling apiUsersUserIdCartProductIdDelete.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<any>('delete',`${this.basePath}/api/users/${encodeURIComponent(String(userId))}/cart/${encodeURIComponent(String(productId))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Update an item in a user&#x27;s cart
     * Modify the details (e.g., quantity, size) of a product in the user&#x27;s cart using the product ID.
     * @param body 
     * @param userId Unique identifier of the user.
     * @param productId Unique identifier of the product to update in the cart.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiUsersUserIdCartProductIdPut(body: CartProductIdBody, userId: any, productId: any, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public apiUsersUserIdCartProductIdPut(body: CartProductIdBody, userId: any, productId: any, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public apiUsersUserIdCartProductIdPut(body: CartProductIdBody, userId: any, productId: any, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public apiUsersUserIdCartProductIdPut(body: CartProductIdBody, userId: any, productId: any, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling apiUsersUserIdCartProductIdPut.');
        }

        if (userId === null || userId === undefined) {
            throw new Error('Required parameter userId was null or undefined when calling apiUsersUserIdCartProductIdPut.');
        }

        if (productId === null || productId === undefined) {
            throw new Error('Required parameter productId was null or undefined when calling apiUsersUserIdCartProductIdPut.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<any>('put',`${this.basePath}/api/users/${encodeURIComponent(String(userId))}/cart/${encodeURIComponent(String(productId))}`,
            {
                body: body,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
