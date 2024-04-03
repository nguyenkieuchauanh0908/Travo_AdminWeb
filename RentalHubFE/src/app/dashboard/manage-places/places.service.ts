import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, tap } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { handleError } from 'src/app/shared/handle-errors';
import { PaginationService } from 'src/app/shared/pagination/pagination.service';
import { resDataDTO } from 'src/app/shared/resDataDTO';
import { environment } from 'src/environments/environment';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  constructor(
    private http: HttpClient,
    private paginationService: PaginationService
  ) {}

  currentPlacesList = new Subject<Place[] | null>();
  getCurrentPlacesList = this.currentPlacesList.asObservable();
  setCurrentPlaces(updatedList: Place[] | null) {
    this.currentPlacesList.next(updatedList);
  }

  getAllPlaces(page: number, limit: number) {
    let queryParams = new HttpParams()
      .append('page', page)
      .append('limit', limit);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'admin/get-places', {
        params: queryParams,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          console.log(res.message);
          this.setCurrentPlaces(res.message);
          this.paginationService.pagination = res.pagination;
          this.paginationService.paginationChanged.next(res.pagination);
        })
      );
  }
}
