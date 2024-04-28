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

  getFlightById(flightId: string) {
    let queryParams = new HttpParams().append('flightId', flightId);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'flight/get-flight-by-id', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  removeFlight(flightId: string) {
    let queryParams = new HttpParams().append('flightId', flightId);
    return this.http
      .delete<resDataDTO>(environment.baseUrl + 'flight/delete-flight', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  updateFlight(updatedFlight: any) {
    return this.http
      .patch<resDataDTO>(environment.baseUrl + 'flight/update-flight', {
        id: updatedFlight.id,
        airline: updatedFlight.airline,
        facilities: updatedFlight.facilities,
        from_place: updatedFlight.from_place,
        no: updatedFlight.no,
        price: updatedFlight.price,
        to_place: updatedFlight.to_place,
        arrive_time: updatedFlight.arrive_time,
        departure_time: updatedFlight.departure_time,
      })

      .pipe(catchError(handleError));
  }

  createFlight(flight: any) {
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'flight/create-flight', {
        airline: flight.airline,
        facilities: flight.facilities,
        from_place: flight.from_place,
        no: flight.no,
        price: flight.price,
        to_place: flight.to_place,
        arrive_time: flight.arrive_time,
        departure_time: flight.departure_time,
      })

      .pipe(catchError(handleError));
  }
}
