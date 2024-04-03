import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, tap } from 'rxjs';
import { handleError } from 'src/app/shared/handle-errors';
import { PaginationService } from 'src/app/shared/pagination/pagination.service';
import { resDataDTO } from 'src/app/shared/resDataDTO';
import { environment } from 'src/environments/environment';
import { Hotel } from '../manage-hotels/hotel.model';

@Injectable({
  providedIn: 'root',
})
export class HotelsService {
  constructor(
    private http: HttpClient,
    private paginationService: PaginationService
  ) {}

  currentHotelsList = new Subject<Hotel[] | null>();
  getCurrentHotelsList = this.currentHotelsList.asObservable();
  setCurrentHotelsList(updatedList: Hotel[] | null) {
    this.currentHotelsList.next(updatedList);
  }

  getAllHotels(page: number, limit: number) {
    let queryParams = new HttpParams()
      .append('page', page)
      .append('limit', limit);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'admin/get-hotels', {
        params: queryParams,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          console.log(res.message);
          this.setCurrentHotelsList(res.message);
          this.paginationService.pagination = res.pagination;
          this.paginationService.paginationChanged.next(res.pagination);
        })
      );
  }
}
