import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAvatarDialogComponent } from './update-avatar-dialog.component';

describe('UpdateAvatarDialogComponent', () => {
  let component: UpdateAvatarDialogComponent;
  let fixture: ComponentFixture<UpdateAvatarDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateAvatarDialogComponent]
    });
    fixture = TestBed.createComponent(UpdateAvatarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
