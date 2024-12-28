import { inject, Injectable } from '@angular/core';
import {
  Review,
  ReviewsService as SwaggerReviewsService,
  ProductIdReviewsBody,
  ReviewsIdBody,
} from '../../generated';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {

  constructor(private reviewsService: SwaggerReviewsService) {}

  // Add a new review for a specific product
  addReview(userId: number, productId: number, rating: number, comment?: string): Observable<Review> {
    const body: ProductIdReviewsBody = {
      rating: rating,
      comment: comment,
    };

    return this.reviewsService.apiUsersUserIdProductsProductIdReviewsPost(body, userId, productId).pipe(
      map((response: Review) => response),
      catchError((error) => {
        console.error('Failed to add review:', error);
        return throwError(() => new Error('Failed to add review.'));
      })
    );
  }

  // Update a review for a specific product
  updateReview(reviewId: number, rating?: number, comment?: string): Observable<Review> {
    const body: ReviewsIdBody = {};

    // Conditionally add properties only if they are provided
    if (rating !== undefined) {
      body.rating = rating;
    }
    if (comment !== undefined) {
      body.comment = comment;
    }

    return this.reviewsService.apiReviewsIdPut(body, reviewId).pipe(
      map((response: Review) => response),
      catchError((error) => {
        console.error(`Failed to update review with ID ${reviewId}:`, error);
        return throwError(() =>
          new Error(`Failed to update review with ID ${reviewId}.`)
        );
      })
    );
  }

  // Get all reviews for a specific product
  getReviewsForProduct(productId: number): Observable<Review[]> {
    return this.reviewsService.apiProductsProductIdReviewsGet(productId).pipe(
      map((response: Review[]) => response),
      catchError((error) => {
        console.error(`Failed to fetch reviews for product with ID ${productId}:`, error);
        return throwError(() =>
          new Error(`Failed to fetch reviews for product with ID ${productId}.`)
        );
      })
    );
  }

  // Get all reviews submitted by a specific user
  getReviewsByUser(userId: number): Observable<Review[]> {
    return this.reviewsService.apiUsersUserIdReviewsGet(userId).pipe(
      map((response: Review[]) => response),
      catchError((error) => {
        console.error(`Failed to fetch reviews by user with ID ${userId}:`, error);
        return throwError(() =>
          new Error(`Failed to fetch reviews by user with ID ${userId}.`)
        );
      })
    );
  }

  // Delete a review by its ID
  deleteReview(reviewId: number): Observable<void> {
    return this.reviewsService.apiReviewsIdDelete(reviewId).pipe(
      map(() => undefined),
      catchError((error) => {
        console.error(`Failed to delete review with ID ${reviewId}:`, error);
        return throwError(() => new Error(`Failed to delete review with ID ${reviewId}.`));
      })
    );
  }
}
