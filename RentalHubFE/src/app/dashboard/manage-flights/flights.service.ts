import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, tap } from 'rxjs';
import { handleError } from 'src/app/shared/handle-errors';
import { PaginationService } from 'src/app/shared/pagination/pagination.service';
import { resDataDTO } from 'src/app/shared/resDataDTO';
import { environment } from 'src/environments/environment';
import { Flight } from './flight.model';

@Injectable({
  providedIn: 'root',
})
export class FlightsService {
  constructor(
    private http: HttpClient,
    private paginationService: PaginationService
  ) {}

  currentFlightsList = new Subject<Flight[] | null>();
  getCurrentFlightsList = this.currentFlightsList.asObservable();
  setCurrentFlightsList(updatedList: Flight[] | null) {
    this.currentFlightsList.next(updatedList);
  }

  getAllFlights(page: number, limit: number) {
    let queryParams = new HttpParams()
      .append('page', page)
      .append('limit', limit);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'admin/get-Flights', {
        params: queryParams,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          console.log(res.message);
          this.setCurrentFlightsList(res.message);
          this.paginationService.pagination = res.pagination;
          this.paginationService.paginationChanged.next(res.pagination);
        })
      );
  }
}
