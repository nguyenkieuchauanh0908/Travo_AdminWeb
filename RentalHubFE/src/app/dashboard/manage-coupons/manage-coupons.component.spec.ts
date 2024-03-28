import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCouponsComponent } from './manage-coupons.component';

describe('ManageCouponsComponent', () => {
  let component: ManageCouponsComponent;
  let fixture: ComponentFixture<ManageCouponsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageCouponsComponent]
    });
    fixture = TestBed.createComponent(ManageCouponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
