import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileLeaveAbsentComponent } from './file-leave-absent.component';

describe('FileLeaveAbsentComponent', () => {
  let component: FileLeaveAbsentComponent;
  let fixture: ComponentFixture<FileLeaveAbsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileLeaveAbsentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileLeaveAbsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
