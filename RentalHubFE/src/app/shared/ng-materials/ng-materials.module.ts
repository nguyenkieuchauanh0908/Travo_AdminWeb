import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import {
  NGX_MAT_DATE_FORMATS,
  NgxMatDateFormats,
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
// If using Moment
const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: 'l, LTS',
  },
  display: {
    dateInput: 'l, LTS',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@NgModule({
  declarations: [],
  providers: [{ provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }],
  imports: [
    MatDividerModule,
    MatIconModule,
    MatDatepickerModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatListModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatTooltipModule,
    MatBadgeModule,
    MatMenuModule,
    MatCheckboxModule,
    MatRippleModule,
    MatChipsModule,
    NgxMatDatetimePickerModule,
    NgxMatMomentModule,
  ],
  exports: [
    MatDividerModule,
    MatIconModule,
    MatDatepickerModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatListModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatTooltipModule,
    MatBadgeModule,
    MatMenuModule,
    MatCheckboxModule,
    MatRippleModule,
    MatChipsModule,
    NgxMatDatetimePickerModule,
    NgxMatMomentModule,
  ],
})
export class NgMaterialsModule {}
