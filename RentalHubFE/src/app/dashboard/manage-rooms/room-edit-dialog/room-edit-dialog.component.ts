import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  ViewChild,
  inject,
} from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Room } from '../room.model';
import { RoomsService } from '../rooms.service';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-room-edit-dialog',
  templateUrl: './room-edit-dialog.component.html',
  styleUrls: ['./room-edit-dialog.component.scss'],
})
export class RoomEditDialogComponent {
  updateSuccess = new EventEmitter();
  addSucess = new EventEmitter();
  titles: string = 'Chỉnh sửa thông tin phòng khách sạn';
  isLoading = false;
  roomDetail!: Room;
  roomEditForm = this.formBuilder.group({
    idInputControl: [''],
    nameInputControl: ['', Validators.required],
    maxGuestInputControl: [0, Validators.required],
    totalInputControl: [0, Validators.required],
    priceInputControl: [0, Validators.required],
    serviceInputControl: [''],
    hotelIdInputControl: [''],
    addFilesInputControl: [],
    updateFilesInputControl: [],
  });
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl('');
  filteredServices!: Observable<string[]>;
  services: string[] = [];
  allServices: string[] = [
    'FREE_WIFI',
    'NON_REFUNDABLE',
    'NONE_SMOKING',
    'SWIMMING_POOL',
    'CURRENCY_EXCHANGE',
    'RESTAURANT',
    '24_HOURS_FRONT_DESK',
  ];
  @ViewChild('servicesInput') servicesInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);
  selectedFile?: FileList;
  selectedFileNames?: String[];
  previewImage: string = '';
  constructor(
    public dialog: MatDialog,
    private roomService: RoomsService,
    private formBuilder: FormBuilder,
    private notifierService: NotifierService,
    @Inject(MAT_DIALOG_DATA) public data: Room | string | null | undefined
  ) {
    this.isLoading = true;
    //Nếu có thông tin phòng truyền vào là update
    if (typeof data !== 'string') {
      this.titles = 'Chỉnh sửa thông tin phòng khách sạn';
      this.roomDetail = data!;
      this.roomEditForm.patchValue({
        idInputControl: this.roomDetail.id,
        nameInputControl: this.roomDetail.name,
        maxGuestInputControl: this.roomDetail.max_guest,
        totalInputControl: this.roomDetail.total,
        priceInputControl: this.roomDetail.price,
        hotelIdInputControl: this.roomDetail.hotel,
      });
      this.previewImage = this.roomDetail.image;
      this.services = this.roomDetail.services;
    }
    //Nếu không có thông tin phòng truyền vào thì là thêm mới
    else {
      this.titles = 'Thêm phòng khác sạn';
      if (typeof this.data === 'string') {
        this.roomEditForm.patchValue({
          hotelIdInputControl: this.data,
        });
      }
    }
    this.filteredServices =
      this.roomEditForm.controls.serviceInputControl.valueChanges.pipe(
        startWith(null),
        map((service: string | null) =>
          service ? this._filter(service) : this.allServices.slice()
        )
      );
    this.roomEditForm.controls['hotelIdInputControl'].disable();
    this.isLoading = false;
  }

  //Thêm dịch vụ
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.services.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
  }

  //Loại bỏ dịch vụ
  remove(fruit: string): void {
    const index = this.services.indexOf(fruit);

    if (index >= 0) {
      this.services.splice(index, 1);

      this.announcer.announce(`Removed ${fruit}`);
    }
  }

  //Chọn dịch vụ
  selected(event: MatAutocompleteSelectedEvent): void {
    this.services.push(event.option.viewValue);
    this.servicesInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  //Filter dịch vụ
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allServices.filter((fruit) =>
      fruit.toLowerCase().includes(filterValue)
    );
  }

  //Gửi form
  onSubmit() {
    this.isLoading = true;
    console.log('on submiting post ...');
    console.log('Form data: ', this.roomEditForm.value);
    let image: File | string = '';
    if (this.selectedFile) {
      image = this.selectedFile[0];
    }
    //Update
    if (typeof this.data !== 'string') {
      let updatedRoom: Room = {
        id: this.data!.id,
        image: this.previewImage,
        name: this.roomEditForm.value.nameInputControl!,
        max_guest: this.roomEditForm.value.maxGuestInputControl!,
        total: this.roomEditForm.value.totalInputControl!,
        price: this.roomEditForm.value.priceInputControl!,
        hotel: this.data!.hotel!,
        services: this.services,
      };
      this.roomService.updateRoom(updatedRoom, image).subscribe(
        (res) => {
          if (res.message) {
            this.updateSuccess.emit(updatedRoom);
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
        this.roomService
          .createRoom(this.data, this.roomEditForm.value, image, this.services)
          .subscribe(
            (res) => {
              if (res.message) {
                this.addSucess.emit();
                this.notifierService.notify(
                  'success',
                  'Thêm mới loại phòng khách sạn thành công!'
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

  //Chọn file ảnh
  selectFiles(event: any): void {
    console.log('On selecting image...');
    this.previewImage = '';
    this.selectedFileNames = [];
    this.selectedFile = event.target.files;
    if (this.selectedFile) {
      const numberOfFiles = this.selectedFile.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.previewImage = e.target.result;
        };
        reader.readAsDataURL(this.selectedFile[i]);
        this.selectedFileNames.push(this.selectedFile[i].name);
      }
    }
  }
}
