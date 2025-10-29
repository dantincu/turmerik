import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkAppSetup } from './trmrk-app-setup-page';

describe('TrmrkAppSetup', () => {
  let component: TrmrkAppSetup;
  let fixture: ComponentFixture<TrmrkAppSetup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkAppSetup],
    }).compileComponents();

    fixture = TestBed.createComponent(TrmrkAppSetup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
