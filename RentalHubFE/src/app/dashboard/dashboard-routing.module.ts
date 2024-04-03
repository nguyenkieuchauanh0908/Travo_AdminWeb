import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { DashboardComponent } from './dashboard.component';
import { ManageHotelsComponent } from './manage-hotels/manage-hotels.component';
import { ManageFlightsComponent } from './manage-flights/manage-flights.component';
import { ManageCouponsComponent } from './manage-coupons/manage-coupons.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManagePlacesComponent } from './manage-places/manage-places.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'manage-places',
        component: ManagePlacesComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'manage-hotels',
        component: ManageHotelsComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'manage-flights',
        component: ManageFlightsComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'manage-coupons',
        component: ManageCouponsComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'manage-users',
        component: ManageUsersComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'statistics',
        component: StatisticsComponent,
        // canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
