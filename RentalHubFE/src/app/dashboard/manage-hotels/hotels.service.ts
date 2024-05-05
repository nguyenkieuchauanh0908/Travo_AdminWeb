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

  getHotelById(hotelId: string) {
    let queryParams = new HttpParams().append('hotelId', hotelId);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'hotel/get-hotel-by-id', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  updateHotelById(id: string, form: any, image: File | string) {
    let body = new FormData();
    body.append('id', id);
    body.append('information', form.informationInputControl);
    body.append('location', form.locationInputControl);
    body.append('location_description', form.locationInputControl);
    body.append('max_guest', form.maxGuestsInputControl);
    body.append('max_room', form.maxRoomsInputControl);
    body.append('name', form.nameInputControl);
    body.append('price', form.priceInputControl);
    body.append('type_price', form.typeInputControl);
    if (typeof image !== 'string') {
      body.append('image', image);
    }
    return this.http
      .patch<resDataDTO>(environment.baseUrl + 'hotel/update-hotel', body)
      .pipe(catchError(handleError));
  }

  addNewHotel(form: any, image: File | string) {
    let body = new FormData();
    body.append('information', form.informationInputControl);
    body.append('location', form.locationInputControl);
    body.append('location_description', form.locationInputControl);
    body.append('max_guest', form.maxGuestsInputControl);
    body.append('max_room', form.maxRoomsInputControl);
    body.append('name', form.nameInputControl);
    body.append('price', form.priceInputControl);
    body.append('rating', '5');
    body.append('total_review', '0');
    body.append('type_price', form.typeInputControl);
    body.append('image', image);

    return this.http
      .post<resDataDTO>(environment.baseUrl + 'hotel/create-hotel', body)
      .pipe(catchError(handleError));
  }

  deleteHotel(hotelId: string) {
    let queryParams = new HttpParams().append('hotelId', hotelId);
    return this.http
      .delete<resDataDTO>(environment.baseUrl + 'hotel/delete-hotel', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }
}
