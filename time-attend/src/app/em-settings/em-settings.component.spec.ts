import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmSettingsComponent } from './em-settings.component';

describe('EmSettingsComponent', () => {
  let component: EmSettingsComponent;
  let fixture: ComponentFixture<EmSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
