import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelEditDialogComponent } from './hotel-edit-dialog.component';

describe('HotelEditDialogComponent', () => {
  let component: HotelEditDialogComponent;
  let fixture: ComponentFixture<HotelEditDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HotelEditDialogComponent]
    });
    fixture = TestBed.createComponent(HotelEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
