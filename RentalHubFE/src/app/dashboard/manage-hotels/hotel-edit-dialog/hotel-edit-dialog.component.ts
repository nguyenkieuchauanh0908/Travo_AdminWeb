import { Component, EventEmitter, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HotelsService } from '../hotels.service';
import { Hotel } from '../hotel.model';
import { Validators, FormBuilder } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { RoomEditDialogComponent } from '../../manage-rooms/room-edit-dialog/room-edit-dialog.component';
import { Room } from '../../manage-rooms/room.model';

@Component({
  selector: 'app-hotel-edit-dialog',
  templateUrl: './hotel-edit-dialog.component.html',
  styleUrls: ['./hotel-edit-dialog.component.scss'],
})
export class HotelEditDialogComponent {
  updateSuccess = new EventEmitter();
  addSucess = new EventEmitter();
  titles: string = 'Chỉnh sửa thông tin khách sạn';
  isLoading = false;
  hotelId!: string;
  hotelDetail: any;
  hotelEditForm = this.formBuilder.group({
    idInputControl: [''],
    informationInputControl: ['', Validators.required],
    locationInputControl: ['', Validators.required],
    locationDescInputControl: ['', Validators.required],
    maxGuestsInputControl: [new Number(), Validators.required],
    maxRoomsInputControl: [new Number(), Validators.required],
    nameInputControl: ['', Validators.required],
    priceInputControl: [new Number(), Validators.required],
    ratingInputControl: [new Number()],
    totalReviewInputControl: [new Number()],
    typeInputControl: ['', Validators.required],
    addFilesInputControl: [],
    updateFilesInputControl: [],
  });
  selectedFile?: FileList;
  selectedFileNames?: String[];
  preview: string = '';
  constructor(
    public dialog: MatDialog,
    private hotelService: HotelsService,
    private formBuilder: FormBuilder,
    private notifierService: NotifierService,
    @Inject(MAT_DIALOG_DATA) public data: Hotel | null
  ) {
    this.isLoading = true;
    //Update
    if (data) {
      this.hotelService.getHotelById(data.id).subscribe((res) => {
        if (res.message) {
          this.isLoading = false;
          this.hotelDetail = res.message;
          //Initiate form data
          this.preview = this.hotelDetail.image;
          this.hotelEditForm.patchValue({
            idInputControl: this.hotelDetail.id,
            informationInputControl: this.hotelDetail.information,
            locationInputControl: this.hotelDetail.location,
            locationDescInputControl: this.hotelDetail.location_description,
            maxGuestsInputControl: this.hotelDetail.max_guest,
            maxRoomsInputControl: this.hotelDetail.max_room,
            nameInputControl: this.hotelDetail.name,
            priceInputControl: this.hotelDetail.price,
            ratingInputControl: this.hotelDetail.rating,
            totalReviewInputControl: this.hotelDetail.total_review,
            typeInputControl: this.hotelDetail.type_price,
          });
        }
      });
    }
    //Add
    else {
      this.hotelEditForm.patchValue({
        ratingInputControl: 5,
        totalReviewInputControl: 0,
      });
    }
    this.hotelEditForm.controls['idInputControl'].disable();
    this.hotelEditForm.controls['ratingInputControl'].disable();
    this.hotelEditForm.controls['totalReviewInputControl'].disable();
    this.isLoading = false;
  }

  addNewRoom() {
    console.log('Seeing Room detail....');
    this.dialog.open(RoomEditDialogComponent, {
      width: '1000px',
      data: this.data!.id,
    });
  }

  onSubmit() {
    this.isLoading = true;
    console.log('on submiting post ...');
    console.log('Form data: ', this.hotelEditForm.value);
    let image: File | string = '';
    if (this.selectedFile) {
      image = this.selectedFile[0];
    }
    //Update
    if (this.data) {
      let updatedHotel: Hotel = {
        id: this.data.id,
        image: this.preview,
        name: this.hotelEditForm.value.nameInputControl!,
        rating: this.hotelEditForm.value.ratingInputControl!,
        informations: this.hotelEditForm.value.informationInputControl!,
        location: this.hotelEditForm.value.locationInputControl!,
        location_description:
          this.hotelEditForm.value.locationDescInputControl!,
        total_review: this.hotelEditForm.value.totalReviewInputControl!,
        type_price: this.hotelEditForm.value.typeInputControl!,
        max_guest: this.hotelEditForm.value.maxGuestsInputControl!,
        max_rooom: this.hotelEditForm.value.maxRoomsInputControl!,
        price: this.hotelEditForm.value.priceInputControl!,
      };
      this.hotelService
        .updateHotelById(this.hotelDetail.id, this.hotelEditForm.value, image)
        .subscribe(
          (res) => {
            if (res.message) {
              this.updateSuccess.emit(updatedHotel);
              this.notifierService.notify(
                'success',
                'Cập nhật thông tin thành công'
              );

              this.isLoading = false;
            }
          },
          (errMsg) => {
            this.isLoading = false;
            this.notifierService.notify('error', errMsg);
          }
        );
    }
    //Add
    else {
      console.log('Adding room...');
      if (image) {
        this.hotelService
          .addNewHotel(this.hotelEditForm.value, image)
          .subscribe(
            (res) => {
              if (res.message) {
                this.addSucess.emit();
                this.notifierService.notify(
                  'success',
                  'Thêm mới khách sạn thành công!'
                );

                this.isLoading = false;
              }
            },
            (errMsg) => {
              this.isLoading = false;
              this.notifierService.notify('error', errMsg);
            }
          );
      } else {
        this.notifierService.notify('error', 'Vui lòng chọn ảnh!');
      }
    }
    this.isLoading = false;
  }

  selectFiles(event: any): void {
    console.log('On selecting image...');
    this.preview = '';
    this.selectedFileNames = [];
    this.selectedFile = event.target.files;
    if (this.selectedFile) {
      const numberOfFiles = this.selectedFile.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.preview = e.target.result;
        };
        reader.readAsDataURL(this.selectedFile[i]);
        this.selectedFileNames.push(this.selectedFile[i].name);
      }
    }
  }
}
