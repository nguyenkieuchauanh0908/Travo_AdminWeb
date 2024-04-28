import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightEditDialogComponent } from './flight-edit-dialog.component';

describe('FlightEditDialogComponent', () => {
  let component: FlightEditDialogComponent;
  let fixture: ComponentFixture<FlightEditDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlightEditDialogComponent]
    });
    fixture = TestBed.createComponent(FlightEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
