import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessHoursList } from './business-hours-list';

describe('BusinessHourList', () => {
  let component: BusinessHoursList;
  let fixture: ComponentFixture<BusinessHoursList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessHoursList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessHoursList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
