import { Component, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import { PostItem } from 'src/app/posts/posts-list/post-item/post-item.model';
import {
  Pagination,
  PaginationService,
} from 'src/app/shared/pagination/pagination.service';
import { HotelsService } from './hotels.service';
import { Hotel } from './hotel.model';
import { HotelEditDialogComponent } from './hotel-edit-dialog/hotel-edit-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-manage-hotels',
  templateUrl: './manage-hotels.component.html',
  styleUrls: ['./manage-hotels.component.scss'],
})
export class ManageHotelsComponent {
  title = 'Quản lý khách sạn';
  isLoading = false;
  displayedColumns: string[] = [
    'image',
    'name',
    'price',
    'total_review',
    'rating',
    'information',
    'location',
    'location_description',
    'actions',
  ];
  dataSource!: Hotel[];
  myProfile!: User | null;
  currentUid!: string | null;
  historyPosts: PostItem[] = new Array<PostItem>();
  totalPages: number = 1;
  currentPage: number = 1;
  pageItemLimit: number = 5;
  myProfileSub = new Subscription();

  constructor(
    private accountService: AccountService,
    private hotelsService: HotelsService,
    public dialog: MatDialog,
    private notifierService: NotifierService,
    private paginationService: PaginationService
  ) {
    if (this.currentUid) {
      this.myProfile = this.accountService.getProfile(this.currentUid);
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.paginationService.currentPage = 1;
    this.hotelsService.getAllHotels(1, this.pageItemLimit).subscribe(
      (res) => {
        if (res.message) {
          this.isLoading = false;
        }
      },
      (err) => {
        this.notifierService.notify('error', err);
      }
    );
    this.hotelsService.getCurrentHotelsList.subscribe((hotels) => {
      if (hotels) {
        this.dataSource = hotels;
      }
    });
    this.paginationService.paginationChanged.subscribe(
      (pagination: Pagination) => {
        this.totalPages = pagination.total;
      }
    );
  }

  addNewHotel() {
    console.log('Adding new hotel..');
    const dialogRef = this.dialog.open(HotelEditDialogComponent, {
      width: '1000px',
      data: null,
    });
    let sub = dialogRef.componentInstance.addSucess.subscribe(() => {
      this.hotelsService.getAllHotels(this.currentPage, 5).subscribe(
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
      this.hotelsService.getCurrentHotelsList.subscribe((hotels) => {
        if (hotels) {
          this.dataSource = [...hotels];
        }
      });
    });
    dialogRef.afterClosed().subscribe((result) => {
      sub.unsubscribe();
    });
  }

  deleteHotel(hotelId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: 'Bạn có chắc muốn xóa khách sạn này',
    });
    let sub = dialogRef.componentInstance.confirmYes.subscribe(() => {
      this.hotelsService.deleteHotel(hotelId).subscribe((res) => {
        if (res.message) {
          this.dataSource = this.dataSource.filter(
            (hotel) => hotel.id !== hotelId
          );
          this.notifierService.notify('success', 'Xóa thành công!');
        }
      });
    });
    dialogRef.afterClosed().subscribe((result) => {
      sub.unsubscribe();
    });
  }

  seeDetail(hotel: any) {
    console.log('Seeing hotel detail....');
    const dialogRef = this.dialog.open(HotelEditDialogComponent, {
      width: '1000px',
      data: hotel,
    });
    let sub = dialogRef.componentInstance.updateSuccess.subscribe(
      (updatedHotel) => {
        if (this.dataSource) {
          let updatedDtSource: Hotel[] = this.dataSource.map((hotel: Hotel) => {
            if (hotel.id === updatedHotel.id) {
              hotel = updatedHotel;
            }
            return hotel;
          });
          this.dataSource = [...updatedDtSource];
        }
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      sub.unsubscribe();
    });
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
    this.hotelsService.getAllHotels(this.currentPage, 5).subscribe(
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
    this.hotelsService.getCurrentHotelsList.subscribe((hotels) => {
      if (hotels) {
        this.dataSource = hotels;
      }
    });
  }
}
