import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { PostItem } from 'src/app/posts/posts-list/post-item/post-item.model';
import {
  Pagination,
  PaginationService,
} from 'src/app/shared/pagination/pagination.service';
import { Tags } from 'src/app/shared/tags/tag.model';
import { PostSensorDialogComponent } from '../manage-places/post-sensor-dialog/post-sensor-dialog.component';
import { CouponsService } from './coupons.service';
import { NotifierService } from 'angular-notifier';
import { Coupon } from './coupon.model';

@Component({
  selector: 'app-manage-coupons',
  templateUrl: './manage-coupons.component.html',
  styleUrls: ['./manage-coupons.component.scss'],
})
export class ManageCouponsComponent implements OnInit {
  title = 'Quản lý khuyến mại';
  isLoading = false;
  displayedColumns: string[] = ['id', 'endow', 'code', 'price'];
  dataSource!: Coupon[];
  myProfile!: User | null;
  currentUid!: string | null;
  historyPosts: Coupon[] = new Array<Coupon>();
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
    private paginationService: PaginationService,
    private couponsService: CouponsService,
    private notifierService: NotifierService
  ) {
    // if (this.currentUid) {
    //   this.myProfile = this.accountService.getProfile(this.currentUid);
    // }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.paginationService.currentPage = 1;
    this.couponsService.getAllCoupons(1, this.pageItemLimit).subscribe(
      (res) => {
        if (res.message) {
          this.isLoading = false;
        }
      },
      (err) => {
        this.notifierService.notify('error', err);
      }
    );
    this.couponsService.getCurrentCouponsList.subscribe((coupons) => {
      if (coupons) {
        this.dataSource = coupons;
      }
    });
    this.paginationService.paginationChanged.subscribe(
      (pagination: Pagination) => {
        this.totalPages = pagination.total;
      }
    );
  }

  seePost(postDetail: any) {
    // let post = postDetail;
    // if (postDetail._status === 1) {
    //   this.postService.getReportPostById(postDetail._id).subscribe((res) => {
    //     if (res.message) {
    //       post = res.message;
    //       console.log(
    //         '🚀 ~ ReportedPostsComponent ~ this.postService.getReportPostById ~ post:',
    //         post
    //       );
    //       //Nếu đã lấy được thông tin của post thì open sensor dialog
    //       if (post) {
    //         const dialogRef = this.dialog.open(PostSensorDialogComponent, {
    //           width: '1000px',
    //           data: post,
    //         });
    //         let sub = dialogRef.componentInstance.sensorResult.subscribe(
    //           (postId) => {
    //             if (this.dataSource) {
    //               this.dataSource = this.dataSource.filter(
    //                 (post: PostItem) => post._id !== postId
    //               );
    //             }
    //           }
    //         );
    //         sub = dialogRef.componentInstance.denySensorResult.subscribe(
    //           (postId) => {
    //             if (this.dataSource) {
    //               this.dataSource = this.dataSource.filter(
    //                 (post: PostItem) => post._id !== postId
    //               );
    //             }
    //           }
    //         );
    //         dialogRef.afterClosed().subscribe((result) => {
    //           sub.unsubscribe();
    //         });
    //       }
    //     }
    //   });
    // }
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
    this.couponsService.getAllCoupons(this.currentPage, 5).subscribe(
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
    this.couponsService.getCurrentCouponsList.subscribe((coupons) => {
      if (coupons) {
        this.dataSource = coupons;
      }
    });
  }
}
