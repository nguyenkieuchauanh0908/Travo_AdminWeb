import { NgxMatDateAdapter } from '@angular-material-components/datetime-picker';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Injectable,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import * as moment from 'moment';
import { Hotel } from '../../manage-hotels/hotel.model';
import { Flight } from '../flight.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, startWith, map, subscribeOn } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FlightsService } from '../flights.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-flight-edit-dialog',
  templateUrl: './flight-edit-dialog.component.html',
  styleUrls: ['./flight-edit-dialog.component.scss'],
})
export class FlightEditDialogComponent implements OnInit {
  @ViewChild('picker') picker: any;
  @ViewChild('servicesInput') servicesInput!: ElementRef<HTMLInputElement>;
  updateSuccess = new EventEmitter();
  addSucess = new EventEmitter();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  announcer = inject(LiveAnnouncer);
  isLoading = false;
  title!: string;
  dateTimeOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  flightDetails!: Flight;
  flightFacilities: string[] = [];
  allFacilities: string[] = [
    'Wifi',
    'Baggage',
    'Power/USB Port',
    'In flight meal',
  ];
  filteredFacilities!: Observable<string[]>;
  public date!: moment.Moment;
  public disabled = true;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public minDate!: moment.Moment;
  public maxDate!: moment.Moment;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'warn';

  public flightEditForm = new FormGroup({
    noInputControl: new FormControl('', Validators.required),
    priceInputControl: new FormControl(0, Validators.required),
    toPlaceInputControl: new FormControl('', Validators.required),
    fromPlaceInputControl: new FormControl('', Validators.required),
    airlineInputControl: new FormControl('', Validators.required),
    facilitiesInputControl: new FormControl(''),
    arriveTimeInputControl: new FormControl(new Date(), Validators.required),
    departureTimeInputControl: new FormControl(new Date(), Validators.required),
  });

  public options = [
    { value: true, label: 'True' },
    { value: false, label: 'False' },
  ];

  public listColors = ['primary', 'accent', 'warn'];

  public stepHours = [1, 2, 3, 4, 5];
  public stepMinutes = [1, 5, 10, 15, 20, 25];
  public stepSeconds = [1, 5, 10, 15, 20, 25];

  ngOnInit(): void {}

  constructor(
    private flightService: FlightsService,
    public notifierService: NotifierService,
    @Inject(MAT_DIALOG_DATA) public data: Flight | string | null | undefined
  ) {
    this.isLoading = true;
    //Nếu có thông tin flight truyền vào là update
    if (typeof data !== 'string') {
      this.title = 'Chỉnh sửa thông tin chuyến bay';
      this.flightDetails = data!;
      this.flightEditForm.patchValue({
        noInputControl: this.flightDetails.no,
        priceInputControl: this.flightDetails.price,
        toPlaceInputControl: this.flightDetails.to_place,
        fromPlaceInputControl: this.flightDetails.from_place,
        airlineInputControl: this.flightDetails.airline,
        departureTimeInputControl: new Date(this.flightDetails.departure_time),
        arriveTimeInputControl: new Date(this.flightDetails.arrive_time),
      });
      this.flightFacilities = this.flightDetails.facilities;
    }
    //Nếu không có thông tin flight truyền vào thì là thêm mới
    else {
      this.title = 'Thêm chuyến bay';
    }
    this.filteredFacilities =
      this.flightEditForm.controls.facilitiesInputControl.valueChanges.pipe(
        startWith(null),
        map((service: string | null) =>
          service ? this._filter(service) : this.allFacilities.slice()
        )
      );
    this.isLoading = false;
  }

  //Thêm tiệc ích
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add facility
    if (value) {
      this.flightFacilities.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.flightEditForm.controls.facilitiesInputControl.setValue(null);
  }

  //Loại bỏ tiệc ích
  remove(fruit: string): void {
    const index = this.flightFacilities.indexOf(fruit);

    if (index >= 0) {
      this.flightFacilities.splice(index, 1);

      this.announcer.announce(`Removed ${fruit}`);
    }
  }

  //Chọn tiệc ích
  selected(event: MatAutocompleteSelectedEvent): void {
    this.flightFacilities.push(event.option.viewValue);
    this.servicesInput.nativeElement.value = '';
    this.flightEditForm.controls.facilitiesInputControl.setValue(null);
  }

  //Filter tiệc ích
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFacilities.filter((facilitity) =>
      facilitity.toLowerCase().includes(filterValue)
    );
  }

  saveChanges() {
    this.isLoading = true;
    //Update
    if (typeof this.data !== 'string') {
      let updatedFlight = {
        id: this.data!.id,
        no: this.flightEditForm.controls.noInputControl.value!,
        price: this.flightEditForm.controls.priceInputControl.value!,
        to_place: this.flightEditForm.controls.toPlaceInputControl.value!,
        airline: this.flightEditForm.controls.airlineInputControl.value!,
        from_place: this.flightEditForm.controls.fromPlaceInputControl.value!,
        departure_time: new Date(
          this.flightEditForm.controls.departureTimeInputControl.value!.toString()
        ).toLocaleDateString('VN', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        }),
        arrive_time: new Date(
          this.flightEditForm.controls.arriveTimeInputControl.value!.toString()
        ).toLocaleDateString('VN', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        }),
        facilities: this.flightFacilities,
      };
      this.flightService.updateFlight(updatedFlight).subscribe(
        (res) => {
          if (res.message) {
            this.updateSuccess.emit(updatedFlight);
            this.notifierService.notify(
              'success',
              'Cập nhật chuyến bay thành công!'
            );
            this.isLoading = false;
          }
        },
        (err) => {
          this.notifierService.notify(
            'error',
            'Đã có lỗi xảy ra, vui lòng thử lại!'
          );
        }
      );
      this.isLoading = false;
    }
    //Add
    else {
      let flight = {
        no: this.flightEditForm.controls.noInputControl.value!,
        price: this.flightEditForm.controls.priceInputControl.value!,
        to_place: this.flightEditForm.controls.toPlaceInputControl.value!,
        airline: this.flightEditForm.controls.airlineInputControl.value!,
        from_place: this.flightEditForm.controls.fromPlaceInputControl.value!,
        departure_time: new Date(
          this.flightEditForm.controls.departureTimeInputControl.value!.toString()
        ).toLocaleDateString('VN', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        }),
        arrive_time: new Date(
          this.flightEditForm.controls.arriveTimeInputControl.value!.toString()
        ).toLocaleDateString('VN', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        }),
        facilities: this.flightFacilities,
      };
      this.flightService.createFlight(flight).subscribe(
        (res) => {
          if (res.message) {
            this.isLoading = false;
            this.notifierService.notify(
              'success',
              'Thêm chuyến bay thành công!'
            );
            this.addSucess.emit();
          }
        },
        (err) => {
          this.notifierService.notify(
            'error',
            'Đã có lỗi xảy ra, vui lòng thử lại!'
          );
        }
      );
    }
    this.isLoading = false;
  }
}
