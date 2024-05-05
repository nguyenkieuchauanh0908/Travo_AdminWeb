import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { FormsModule } from '@angular/forms';
import { ManagePlacesComponent } from './manage-places/manage-places.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PostSensorDialogComponent } from './manage-places/post-sensor-dialog/post-sensor-dialog.component';
import { ManageHotelsComponent } from './manage-hotels/manage-hotels.component';
import { ManageFlightsComponent } from './manage-flights/manage-flights.component';
import { AccountEditDialogComponent } from './account-edit-dialog/account-edit-dialog.component';
import { UpdateAvatarDialogComponent } from './update-avatar-dialog/update-avatar-dialog.component';
import { LoginDetailUpdateDialogComponent } from './login-detail-update-dialog/login-detail-update-dialog.component';
import { ManageCouponsComponent } from './manage-coupons/manage-coupons.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { UpdateEmployeeLoginDetailDialogComponent } from './update-employee-login-detail-dialog/update-employee-login-detail-dialog.component';
import { AddNewEmployeeDialogComponent } from './manage-users/add-new-employee-dialog/add-new-employee-dialog.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { TotalDataComponent } from './statistics/total-data/total-data.component';
import { HotelEditDialogComponent } from './manage-hotels/hotel-edit-dialog/hotel-edit-dialog.component';
import { PlaceEditDialogComponent } from './manage-places/place-edit-dialog/place-edit-dialog.component';
import { CouponEditDialogComponent } from './manage-coupons/coupon-edit-dialog/coupon-edit-dialog.component';
import { ManageRoomsComponent } from './manage-rooms/manage-rooms.component';
import { RoomEditDialogComponent } from './manage-rooms/room-edit-dialog/room-edit-dialog.component';
import { FlightEditDialogComponent } from './manage-flights/flight-edit-dialog/flight-edit-dialog.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ManagePlacesComponent,
    PostSensorDialogComponent,
    ManageHotelsComponent,
    ManageFlightsComponent,
    AccountEditDialogComponent,
    UpdateAvatarDialogComponent,
    LoginDetailUpdateDialogComponent,
    ManageCouponsComponent,
    ManageUsersComponent,
    UpdateEmployeeLoginDetailDialogComponent,
    AddNewEmployeeDialogComponent,
    StatisticsComponent,
    HotelEditDialogComponent,
    PlaceEditDialogComponent,
    CouponEditDialogComponent,
    ManageRoomsComponent,
    RoomEditDialogComponent,
    FlightEditDialogComponent,
  ],
  imports: [CommonModule, FormsModule, DashboardRoutingModule, SharedModule],
  providers: [],
})
export class DashBoardModule {}
