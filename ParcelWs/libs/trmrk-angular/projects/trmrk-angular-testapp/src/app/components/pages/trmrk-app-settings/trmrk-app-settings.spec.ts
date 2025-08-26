import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkAppSettings } from './trmrk-app-settings';

describe('TrmrkSettings', () => {
  let component: TrmrkAppSettings;
  let fixture: ComponentFixture<TrmrkAppSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkAppSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(TrmrkAppSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
