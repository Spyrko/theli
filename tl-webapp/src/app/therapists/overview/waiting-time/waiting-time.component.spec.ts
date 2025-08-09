import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingTimeComponent } from './waiting-time.component';

describe('WaitingTimeComponent', () => {
  let component: WaitingTimeComponent;
  let fixture: ComponentFixture<WaitingTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaitingTimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaitingTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
