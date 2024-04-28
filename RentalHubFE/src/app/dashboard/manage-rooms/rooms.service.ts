import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, tap } from 'rxjs';
import { handleError } from 'src/app/shared/handle-errors';
import { PaginationService } from 'src/app/shared/pagination/pagination.service';
import { resDataDTO } from 'src/app/shared/resDataDTO';
import { environment } from 'src/environments/environment';
import { Room } from './room.model';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  currentRoomsList = new Subject<Room[] | null>();
  getCurrentRoomsList = this.currentRoomsList.asObservable();
  setCurrentRooms(updatedList: Room[] | null) {
    this.currentRoomsList.next(updatedList);
  }
  constructor(
    private http: HttpClient,
    private paginationService: PaginationService
  ) {}

  getAllRooms(page: number, limit: number) {
    let queryParams = new HttpParams()
      .append('page', page)
      .append('limit', limit);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'room/get-rooms', {
        params: queryParams,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.message) {
            this.setCurrentRooms(res.message);
            this.paginationService.pagination = res.pagination;
            this.paginationService.paginationChanged.next(res.pagination);
          }
        })
      );
  }
  getRoomDetails(roomId: string) {
    let queryParams = new HttpParams().append('roomId', roomId);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'room/get-room-by-id', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  deleteRoom(roomId: string) {
    let queryParams = new HttpParams().append('roomId', roomId);
    return this.http
      .delete<resDataDTO>(environment.baseUrl + 'room/delete-room', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  updateRoom(updatedRoom: any, image: File | string) {
    let services = ['FREE_WIFE', 'CURRENCY_EXCHANGE', '24_HOURS_FRONT_DESK'];
    let body = new FormData();
    body.append('id', updatedRoom.id);
    body.append('total', updatedRoom.total);
    body.append('max_guest', updatedRoom.max_guest);
    body.append('name', updatedRoom.name);
    body.append('price', updatedRoom.price);

    for (let service of services) {
      body.append('services', service);
    }

    if (typeof image !== 'string') {
      body.append('image', image);
    }
    return this.http
      .patch<resDataDTO>(environment.baseUrl + 'room/update-room', body)
      .pipe(catchError(handleError));
  }

  createRoom(
    hotelId: string,
    form: any,
    image: File | string,
    services: string[]
  ) {
    let body = new FormData();
    body.append('hotel', hotelId);
    body.append('total', form.totalInputControl);
    body.append('max_guest', form.maxGuestInputControl);
    body.append('name', form.nameInputControl);
    body.append('price', form.priceInputControl);

    for (let service of services) {
      body.append('services', service);
    }

    if (typeof image !== 'string') {
      body.append('image', image);
    }
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'room/create-room', body)
      .pipe(catchError(handleError));
  }
}
