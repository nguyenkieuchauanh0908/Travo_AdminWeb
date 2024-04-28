import { Component, EventEmitter, Inject } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Place } from '../../manage-places/place.model';
import { Coupon } from '../coupon.model';
import { CouponsService } from '../coupons.service';

@Component({
  selector: 'app-coupon-edit-dialog',
  templateUrl: './coupon-edit-dialog.component.html',
  styleUrls: ['./coupon-edit-dialog.component.scss'],
})
export class CouponEditDialogComponent {
  updateSuccess = new EventEmitter();
  addSucess = new EventEmitter();
  titles: string = 'Chỉnh sửa thông tin mã giảm giá';
  isLoading = false;
  hotelId!: string;
  couponDetail: any;
  couponEditForm = this.formBuilder.group({
    idInputControl: [''],
    codeInputControl: ['', Validators.required],
    priceInputControl: [0, Validators.required],
    addFilesInputControl: [],
    updateFilesInputControl: [],
  });
  selectedFile?: FileList;
  selectedFileNames?: String[];
  preview: string = '';
  constructor(
    public dialog: MatDialog,
    private couponService: CouponsService,
    private formBuilder: FormBuilder,
    private notifierService: NotifierService,
    @Inject(MAT_DIALOG_DATA) public data: Place | null
  ) {
    this.isLoading = true;
    if (data) {
      this.titles = 'Chỉnh sửa thông tin mã giảm giá';
      this.couponDetail = data;
      this.preview = this.couponDetail.endow;
      this.couponEditForm.patchValue({
        idInputControl: this.couponDetail.id,
        codeInputControl: this.couponDetail.code,
        priceInputControl: this.couponDetail.price * 100,
      });
    } else {
      this.titles = 'Thêm mã giảm giá';
    }
    this.isLoading = false;
  }

  onSubmit() {
    this.isLoading = true;
    console.log('on submiting post ...');
    console.log('Form data: ', this.couponEditForm.value);
    let image: File | string = '';
    if (this.selectedFile) {
      image = this.selectedFile[0];
    }
    //Update
    if (this.data) {
      let updatedCoupon: Coupon = {
        id: this.data.id,
        endow: this.preview,
        code: this.couponEditForm.value.codeInputControl!,
        price: this.couponEditForm.value.priceInputControl! / 100,
      };
      this.couponService
        .updateCoupon(this.couponEditForm.value, image)
        .subscribe(
          (res) => {
            if (res.message) {
              this.updateSuccess.emit(updatedCoupon);
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
        this.couponService
          .addNewCoupon(this.couponEditForm.value, image)
          .subscribe(
            (res) => {
              if (res.message) {
                this.addSucess.emit();
                this.notifierService.notify(
                  'success',
                  'Thêm mới coupon thành công!'
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
