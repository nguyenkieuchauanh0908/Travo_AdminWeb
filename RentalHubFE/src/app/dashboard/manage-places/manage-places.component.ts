import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { PostEditDialogComponent } from 'src/app/accounts/posting-history/post-edit-dialog/post-edit-dialog.component';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { PostItem } from 'src/app/posts/posts-list/post-item/post-item.model';
import { Tags } from 'src/app/shared/tags/tag.model';
import { PostSensorDialogComponent } from './post-sensor-dialog/post-sensor-dialog.component';
import {
  Pagination,
  PaginationService,
} from 'src/app/shared/pagination/pagination.service';
import { PlacesService } from './places.service';
import { Place } from './place.model';
@Component({
  selector: 'app-manage-places',
  templateUrl: './manage-places.component.html',
  styleUrls: ['./manage-places.component.scss'],
})
export class ManagePlacesComponent implements OnInit {
  isLoading = false;
  displayedColumns: string[] = ['image', 'name', 'rating', 'desc'];
  title = 'Quản lý địa điểm';
  dataSource!: Place[];
  myProfile!: User | null;
  currentUid!: string | null;
  historyPosts: PostItem[] = new Array<PostItem>();
  currentPage: number = 1;
  pageItemLimit: number = 5;
  myProfileSub = new Subscription();
  getTagSub = new Subscription();
  sourceTags: Set<Tags> = new Set();
  totalPages: number = 1;

  constructor(
    private accountService: AccountService,
    private postService: PostService,
    private placeService: PlacesService,
    private notifierService: NotifierService,
    public dialog: MatDialog,
    private paginationService: PaginationService
  ) {
    // if (this.currentUid) {
    //   this.myProfile = this.accountService.getProfile(this.currentUid);
    // }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.paginationService.currentPage = 1;
    this.placeService.getAllPlaces(1, this.pageItemLimit).subscribe(
      (res) => {
        if (res.message) {
          this.isLoading = false;
        }
      },
      (err) => {
        this.notifierService.notify('error', err);
      }
    );
    this.placeService.getCurrentPlacesList.subscribe((places) => {
      if (places) {
        this.dataSource = places;
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
    this.placeService.getAllPlaces(this.currentPage, 5).subscribe(
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
    this.placeService.getCurrentPlacesList.subscribe((places) => {
      if (places) {
        this.dataSource = places;
      }
    });
    this.paginationService.paginationChanged.subscribe(
      (pagination: Pagination) => {
        this.totalPages = pagination.total;
      }
    );
  }
}
