import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { PostItem } from 'src/app/posts/posts-list/post-item/post-item.model';
import { PaginationService } from 'src/app/shared/pagination/pagination.service';
import { Tags } from 'src/app/shared/tags/tag.model';
import { PostSensorDialogComponent } from '../manage-places/post-sensor-dialog/post-sensor-dialog.component';

@Component({
  selector: 'app-manage-coupons',
  templateUrl: './manage-coupons.component.html',
  styleUrls: ['./manage-coupons.component.scss'],
})
export class ManageCouponsComponent implements OnInit {
  title = 'Quản lý chuyến bay';
  isLoading = false;
  displayedColumns: string[] = [
    'image',
    'title',
    'desc',
    'author',
    'lastUpdate',
  ];
  dataSource!: PostItem[];
  myProfile!: User | null;
  currentUid!: string | null;
  historyPosts: PostItem[] = new Array<PostItem>();
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
    private paginationService: PaginationService
  ) {
    if (this.currentUid) {
      this.myProfile = this.accountService.getProfile(this.currentUid);
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.paginationService.currentPage = 1;
    this.postService.getReportPostList(1, 5).subscribe(
      (res) => {
        this.dataSource = res.data;
        console.log(
          '🚀 ~ file: post-sensor.component.ts:49 ~ PostSensorComponent ~ this.postService.getPostsHistory ~  this.dataSource:',
          this.dataSource
        );
        this.totalPages = res.pagination.total;
        this.isLoading = false;
      },
      (errMsg) => {
        this.isLoading = false;
      }
    );
  }

  seePost(postDetail: any) {
    let post = postDetail;
    if (postDetail._status === 1) {
      this.postService.getReportPostById(postDetail._id).subscribe((res) => {
        if (res.data) {
          post = res.data;
          console.log(
            '🚀 ~ ReportedPostsComponent ~ this.postService.getReportPostById ~ post:',
            post
          );
          //Nếu đã lấy được thông tin của post thì open sensor dialog
          if (post) {
            const dialogRef = this.dialog.open(PostSensorDialogComponent, {
              width: '1000px',
              data: post,
            });

            let sub = dialogRef.componentInstance.sensorResult.subscribe(
              (postId) => {
                if (this.dataSource) {
                  this.dataSource = this.dataSource.filter(
                    (post: PostItem) => post._id !== postId
                  );
                }
              }
            );
            sub = dialogRef.componentInstance.denySensorResult.subscribe(
              (postId) => {
                if (this.dataSource) {
                  this.dataSource = this.dataSource.filter(
                    (post: PostItem) => post._id !== postId
                  );
                }
              }
            );

            dialogRef.afterClosed().subscribe((result) => {
              sub.unsubscribe();
            });
          }
        }
      });
    }
  }

  changeCurrentPage(position: number) {
    this.historyPosts = [];
    this.currentPage = this.paginationService.caculateCurrentPage(position);
    this.postService.getReportPostList(this.currentPage, 5).subscribe((res) => {
      if (res.data) {
        this.dataSource = res.data;
        this.totalPages = res.pagination.total;
      } else {
        this.dataSource = [];
      }
    });
  }
}
