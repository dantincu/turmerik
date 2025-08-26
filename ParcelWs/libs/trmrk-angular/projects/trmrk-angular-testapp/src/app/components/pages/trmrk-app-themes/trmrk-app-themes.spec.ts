import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkAppThemes } from './trmrk-app-themes';

describe('TrmrkAppThemes', () => {
  let component: TrmrkAppThemes;
  let fixture: ComponentFixture<TrmrkAppThemes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkAppThemes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkAppThemes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
