import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceEditDialogComponent } from './place-edit-dialog.component';

describe('PlaceEditDialogComponent', () => {
  let component: PlaceEditDialogComponent;
  let fixture: ComponentFixture<PlaceEditDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlaceEditDialogComponent]
    });
    fixture = TestBed.createComponent(PlaceEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
