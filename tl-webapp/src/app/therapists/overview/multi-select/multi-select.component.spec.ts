import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultiSelectToolbarOverride } from './multi-select.component';

describe('MultiSelectComponent', () => {
  let component: MultiSelectToolbarOverride;
  let fixture: ComponentFixture<MultiSelectToolbarOverride>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSelectToolbarOverride]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MultiSelectToolbarOverride);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
