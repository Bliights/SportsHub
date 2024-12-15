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

import { InlineResponse200 } from '../model/inlineResponse200';
import { UserIdPreferencesBody } from '../model/userIdPreferencesBody';
import { UserIdPreferencesBody1 } from '../model/userIdPreferencesBody1';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class PreferencesService {

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
     * Delete preferences of a user
     * Remove the preferences of a specific user by their ID.
     * @param userId Unique identifier of the user.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiUsersUserIdPreferencesDelete(userId: any, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public apiUsersUserIdPreferencesDelete(userId: any, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public apiUsersUserIdPreferencesDelete(userId: any, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public apiUsersUserIdPreferencesDelete(userId: any, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (userId === null || userId === undefined) {
            throw new Error('Required parameter userId was null or undefined when calling apiUsersUserIdPreferencesDelete.');
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

        return this.httpClient.request<any>('delete',`${this.basePath}/api/users/${encodeURIComponent(String(userId))}/preferences`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Retrieve preferences of a specific user
     * Fetch the preferences of a user by their unique ID.
     * @param userId Unique identifier of the user.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiUsersUserIdPreferencesGet(userId: any, observe?: 'body', reportProgress?: boolean): Observable<InlineResponse200>;
    public apiUsersUserIdPreferencesGet(userId: any, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<InlineResponse200>>;
    public apiUsersUserIdPreferencesGet(userId: any, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<InlineResponse200>>;
    public apiUsersUserIdPreferencesGet(userId: any, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (userId === null || userId === undefined) {
            throw new Error('Required parameter userId was null or undefined when calling apiUsersUserIdPreferencesGet.');
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

        return this.httpClient.request<InlineResponse200>('get',`${this.basePath}/api/users/${encodeURIComponent(String(userId))}/preferences`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Create preferences for a user
     * Add a new set of preferences for a specific user.
     * @param body 
     * @param userId Unique identifier of the user.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiUsersUserIdPreferencesPost(body: UserIdPreferencesBody1, userId: any, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public apiUsersUserIdPreferencesPost(body: UserIdPreferencesBody1, userId: any, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public apiUsersUserIdPreferencesPost(body: UserIdPreferencesBody1, userId: any, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public apiUsersUserIdPreferencesPost(body: UserIdPreferencesBody1, userId: any, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling apiUsersUserIdPreferencesPost.');
        }

        if (userId === null || userId === undefined) {
            throw new Error('Required parameter userId was null or undefined when calling apiUsersUserIdPreferencesPost.');
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

        return this.httpClient.request<any>('post',`${this.basePath}/api/users/${encodeURIComponent(String(userId))}/preferences`,
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
     * Update preferences for a user
     * Modify the preferences of a specific user by their ID.
     * @param body 
     * @param userId Unique identifier of the user.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiUsersUserIdPreferencesPut(body: UserIdPreferencesBody, userId: any, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public apiUsersUserIdPreferencesPut(body: UserIdPreferencesBody, userId: any, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public apiUsersUserIdPreferencesPut(body: UserIdPreferencesBody, userId: any, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public apiUsersUserIdPreferencesPut(body: UserIdPreferencesBody, userId: any, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling apiUsersUserIdPreferencesPut.');
        }

        if (userId === null || userId === undefined) {
            throw new Error('Required parameter userId was null or undefined when calling apiUsersUserIdPreferencesPut.');
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

        return this.httpClient.request<any>('put',`${this.basePath}/api/users/${encodeURIComponent(String(userId))}/preferences`,
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