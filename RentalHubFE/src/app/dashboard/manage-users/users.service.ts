import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, catchError, tap } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { handleError } from 'src/app/shared/handle-errors';
import { PaginationService } from 'src/app/shared/pagination/pagination.service';
import { resDataDTO } from 'src/app/shared/resDataDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(
    private http: HttpClient,
    private paginationService: PaginationService
  ) {}

  currentUsersList = new Subject<User[] | null>();
  getCurrentUsers = this.currentUsersList.asObservable();
  setCurrentUsers(updatedList: User[] | null) {
    this.currentUsersList.next(updatedList);
  }

  getAllUsers(page: number, limit: number) {
    let queryParams = new HttpParams()
      .append('page', page)
      .append('limit', limit);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'admin/get-users', {
        params: queryParams,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          console.log(res.message);
          this.setCurrentUsers(res.message);
          this.paginationService.pagination = res.pagination;
          this.paginationService.paginationChanged.next(res.pagination);
        })
      );
  }
}
