import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { PostItem } from 'src/app/posts/posts-list/post-item/post-item.model';
import { Tags } from 'src/app/shared/tags/tag.model';
import { PostSensorDialogComponent } from '../manage-places/post-sensor-dialog/post-sensor-dialog.component';
import {
  Pagination,
  PaginationService,
} from 'src/app/shared/pagination/pagination.service';
import { FlightsService } from './flights.service';
import { Flight } from './flight.model';

@Component({
  selector: 'app-manage-flights',
  templateUrl: './manage-flights.component.html',
  styleUrls: ['./manage-flights.component.scss'],
})
export class ManageFlightsComponent {
  title = 'Quản lý chuyến bay';
  isLoading = false;
  displayedColumns: string[] = [
    'no',
    'airline',
    'price',
    'from_place',
    'to_place',
  ];
  dataSource!: Flight[];
  myProfile!: User | null;
  currentUid!: string | null;
  historyPosts: Flight[] = new Array<Flight>();
  totalPages: number = 1;
  currentPage: number = 1;
  pageItemLimit: number = 5;
  myProfileSub = new Subscription();
  getTagSub = new Subscription();
  sourceTags: Set<Tags> = new Set();

  constructor(
    private accountService: AccountService,
    private postService: PostService,
    public dialog: MatDialog,
    private notifierService: NotifierService,
    private paginationService: PaginationService,
    private flightsService: FlightsService
  ) {
    if (this.currentUid) {
      this.myProfile = this.accountService.getProfile(this.currentUid);
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.paginationService.currentPage = 1;
    this.flightsService.getAllFlights(1, this.pageItemLimit).subscribe(
      (res) => {
        if (res.message) {
          this.isLoading = false;
        }
      },
      (err) => {
        this.notifierService.notify('error', err);
      }
    );
    this.flightsService.getCurrentFlightsList.subscribe((flights) => {
      if (flights) {
        this.dataSource = flights;
      }
    });
    this.paginationService.paginationChanged.subscribe(
      (pagination: Pagination) => {
        this.totalPages = pagination.total;
      }
    );
  }

  seePost(post: any) {
    // console.log('Seeing post detail....');
    // const dialogRef = this.dialog.open(PostSensorDialogComponent, {
    //   width: '1000px',
    //   data: post,
    // });
    // let sub = dialogRef.componentInstance.sensorResult.subscribe((postId) => {
    //   if (this.dataSource) {
    //     this.dataSource = this.dataSource.filter(
    //       (post: PostItem) => post._id !== postId
    //     );
    //   }
    // });
    // sub = dialogRef.componentInstance.denySensorResult.subscribe((postId) => {
    //   if (this.dataSource) {
    //     this.dataSource = this.dataSource.filter(
    //       (post: PostItem) => post._id !== postId
    //     );
    //   }
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //   sub.unsubscribe();
    // });
  }

  changeCurrentPage(
    position: number,
    toFirstPage: boolean,
    toLastPage: boolean
  ) {
    this.isLoading = true;
    if (position === 1 || position === -1) {
      this.currentPage = this.paginationService.navigatePage(
        position,
        this.currentPage
      );
    }
    if (toFirstPage) {
      this.currentPage = 1;
    } else if (toLastPage) {
      this.currentPage = this.totalPages;
    }
    this.flightsService.getAllFlights(this.currentPage, 5).subscribe(
      (res) => {
        if (res) {
          this.isLoading = false;
        } else {
          this.dataSource = [];
        }
      },
      (err) => {
        this.notifierService.notify('error', err);
      }
    );
    this.flightsService.getCurrentFlightsList.subscribe((flights) => {
      if (flights) {
        this.dataSource = flights;
      }
    });
  }
}
