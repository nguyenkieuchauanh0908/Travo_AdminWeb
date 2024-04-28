import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponEditDialogComponent } from './coupon-edit-dialog.component';

describe('CouponEditDialogComponent', () => {
  let component: CouponEditDialogComponent;
  let fixture: ComponentFixture<CouponEditDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CouponEditDialogComponent]
    });
    fixture = TestBed.createComponent(CouponEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
