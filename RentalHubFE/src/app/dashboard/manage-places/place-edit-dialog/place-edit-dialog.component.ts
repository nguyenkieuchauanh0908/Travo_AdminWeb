import { Component, EventEmitter, Inject } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-place-edit-dialog',
  templateUrl: './place-edit-dialog.component.html',
  styleUrls: ['./place-edit-dialog.component.scss'],
})
export class PlaceEditDialogComponent {
  updateSuccess = new EventEmitter();
  addSucess = new EventEmitter();
  titles: string = 'Chỉnh sửa thông tin địa điểm';
  isLoading = false;
  hotelId!: string;
  placeDetail: any;
  placeEditForm = this.formBuilder.group({
    idInputControl: [''],
    nameInputControl: ['', Validators.required],
    ratingInputControl: [new Number()],
    descInputControl: ['', Validators.required],
    addFilesInputControl: [],
    updateFilesInputControl: [],
  });
  selectedFile?: FileList;
  selectedFileNames?: String[];
  preview: string = '';
  constructor(
    public dialog: MatDialog,
    private placeService: PlacesService,
    private formBuilder: FormBuilder,
    private notifierService: NotifierService,
    @Inject(MAT_DIALOG_DATA) public data: Place | null
  ) {
    this.isLoading = true;
    if (data) {
      this.placeDetail = data;
      this.preview = this.placeDetail.image;
      this.placeEditForm.patchValue({
        idInputControl: this.placeDetail.id,
        nameInputControl: this.placeDetail.name,
        ratingInputControl: this.placeDetail.rating,
        descInputControl: this.placeDetail.desc,
      });
    } else {
      this.placeEditForm.patchValue({
        ratingInputControl: 5,
      });
    }
    this.placeEditForm.controls['ratingInputControl'].disable();
    this.isLoading = false;
  }

  onSubmit() {
    this.isLoading = true;
    console.log('on submiting post ...');
    console.log('Form data: ', this.placeEditForm.value);
    let image: File | string = '';
    if (this.selectedFile) {
      image = this.selectedFile[0];
    }
    //Update
    if (this.data) {
      let updatedHotel: Place = {
        id: this.data.id,
        image: this.preview,
        name: this.placeEditForm.value.nameInputControl!,
        rating: this.data.rating!,
        desc: this.placeEditForm.value.descInputControl!,
      };
      this.placeService.updatePlace(this.placeEditForm.value, image).subscribe(
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
      console.log('Adding hotel...');
      if (image) {
        this.placeService
          .createPlace(this.placeEditForm.value, image)
          .subscribe(
            (res) => {
              if (res.message) {
                this.addSucess.emit();
                this.notifierService.notify(
                  'success',
                  'Thêm mới địa điểm thành công!'
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
