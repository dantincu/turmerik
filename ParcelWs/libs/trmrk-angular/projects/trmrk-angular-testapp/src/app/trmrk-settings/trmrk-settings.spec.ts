import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkSettings } from './trmrk-settings';

describe('TrmrkSettings', () => {
  let component: TrmrkSettings;
  let fixture: ComponentFixture<TrmrkSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
