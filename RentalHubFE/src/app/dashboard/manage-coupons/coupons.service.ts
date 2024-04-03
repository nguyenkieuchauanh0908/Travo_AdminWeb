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
}
