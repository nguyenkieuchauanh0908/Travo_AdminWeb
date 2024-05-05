import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { PostItem } from 'src/app/posts/posts-list/post-item/post-item.model';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import {
  PaginationService,
  Pagination,
} from 'src/app/shared/pagination/pagination.service';
import { Tags } from 'src/app/shared/tags/tag.model';
import { PlacesService } from '../manage-places/places.service';
import { RoomsService } from './rooms.service';
import { Room } from './room.model';
import { RoomEditDialogComponent } from './room-edit-dialog/room-edit-dialog.component';

@Component({
  selector: 'app-manage-rooms',
  templateUrl: './manage-rooms.component.html',
  styleUrls: ['./manage-rooms.component.scss'],
})
export class ManageRoomsComponent {
  isLoading = false;
  displayedColumns: string[] = [
    'image',
    'hotel',
    'price',
    'name',
    'max_guests',
    'total',
    'actions',
  ];
  title = 'Quản lý phòng khách sạn';
  dataSource!: Room[];
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
    private roomsService: RoomsService,
    private placeService: PlacesService,
    private notifierService: NotifierService,
    public dialog: MatDialog,
    private paginationService: PaginationService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.paginationService.currentPage = 1;
    this.roomsService.getAllRooms(1, this.pageItemLimit).subscribe(
      (res) => {
        if (res.message) {
          this.isLoading = false;
        }
      },
      (err) => {
        this.notifierService.notify('error', err);
      }
    );
    this.roomsService.getCurrentRoomsList.subscribe((rooms) => {
      if (rooms) {
        this.dataSource = rooms;
      }
    });
    this.paginationService.paginationChanged.subscribe(
      (pagination: Pagination) => {
        this.totalPages = pagination.total;
      }
    );
  }

  seeDetail(room: any) {
    console.log('Seeing Room detail....');
    const dialogRef = this.dialog.open(RoomEditDialogComponent, {
      width: '1000px',
      data: room,
    });
    let sub = dialogRef.componentInstance.updateSuccess.subscribe(
      (updatedRoom) => {
        if (this.dataSource) {
          let updatedDtSource: Room[] = this.dataSource.map((room: Room) => {
            if (room.id === updatedRoom.id) {
              room = updatedRoom;
              console.log(
                '🚀 ~ ManageRoomsComponent ~ letupdatedDtSource:Room[]=this.dataSource.map ~ room:',
                room
              );
            }
            return room;
          });
          this.dataSource = [...updatedDtSource];
        }
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      sub.unsubscribe();
    });
  }

  delete(roomId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: 'Bạn có chắc muốn xóa ?',
    });
    let sub = dialogRef.componentInstance.confirmYes.subscribe(() => {
      this.roomsService.deleteRoom(roomId).subscribe((res) => {
        if (res.message) {
          this.dataSource = this.dataSource.filter(
            (room) => room.id !== roomId
          );
          this.notifierService.notify('success', 'Xóa thành công!');
        }
      });
    });
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
    this.roomsService.getAllRooms(this.currentPage, 5).subscribe(
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
    this.roomsService.getCurrentRoomsList.subscribe((rooms) => {
      if (rooms) {
        this.dataSource = rooms;
      }
    });
    this.paginationService.paginationChanged.subscribe(
      (pagination: Pagination) => {
        this.totalPages = pagination.total;
      }
    );
  }
}
