import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, tap } from 'rxjs';
import { handleError } from 'src/app/shared/handle-errors';
import { PaginationService } from 'src/app/shared/pagination/pagination.service';
import { resDataDTO } from 'src/app/shared/resDataDTO';
import { environment } from 'src/environments/environment';
import { Coupon } from '../manage-coupons/coupon.model';

@Injectable({
  providedIn: 'root',
})
export class CouponsService {
  constructor(
    private http: HttpClient,
    private paginationService: PaginationService
  ) {}

  currentCouponsList = new Subject<Coupon[] | null>();
  getCurrentCouponsList = this.currentCouponsList.asObservable();
  setCurrentCouponsList(updatedList: Coupon[] | null) {
    this.currentCouponsList.next(updatedList);
  }

  getAllCoupons(page: number, limit: number) {
    let queryParams = new HttpParams()
      .append('page', page)
      .append('limit', limit);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'admin/get-promos', {
        params: queryParams,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          console.log(res.message);
          this.setCurrentCouponsList(res.message);
          this.paginationService.pagination = res.pagination;
          this.paginationService.paginationChanged.next(res.pagination);
        })
      );
  }

  getCouponById(promoId: string) {
    let queryParams = new HttpParams().append('promoId', promoId);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'promo/get-promo-by-id', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  updateCoupon(form: any, image: File | string) {
    let body = new FormData();
    body.append('id', form.idInputControl);
    // body.append('endow', form.endowInputControl);
    body.append('code', form.codeInputControl);
    body.append('price', (form.priceInputControl / 100).toString());
    if (typeof image !== 'string') {
      body.append('image', image);
    }
    return this.http
      .patch<resDataDTO>(environment.baseUrl + 'promo/update-promo', body)
      .pipe(catchError(handleError));
  }

  addNewCoupon(form: any, image: File | string) {
    let body = new FormData();
    body.append('id', form.idInputControl);
    // body.append('endow', form.endowInputControl);
    body.append('code', form.codeInputControl);
    body.append('price', (form.priceInputControl / 100).toString());
    if (typeof image !== 'string') {
      body.append('image', image);
    }
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'promo/create-promo', body)
      .pipe(catchError(handleError));
  }

  deleteCouponb(promoId: string) {
    let httpParams = new HttpParams().append('promoId', promoId);
    return this.http
      .delete<resDataDTO>(environment.baseUrl + 'promo/remove-promo', {
        params: httpParams,
      })
      .pipe(catchError(handleError));
  }
}
