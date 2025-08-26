import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkColoredText } from './trmrk-colored-text';

describe('TrmrkColoredText', () => {
  let component: TrmrkColoredText;
  let fixture: ComponentFixture<TrmrkColoredText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkColoredText]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkColoredText);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
