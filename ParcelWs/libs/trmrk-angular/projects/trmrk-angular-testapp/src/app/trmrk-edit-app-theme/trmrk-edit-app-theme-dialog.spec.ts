import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkEditAppTheme } from './trmrk-edit-app-theme';

describe('TrmrkEditAppTheme', () => {
  let component: TrmrkEditAppTheme;
  let fixture: ComponentFixture<TrmrkEditAppTheme>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkEditAppTheme]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkEditAppTheme);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
