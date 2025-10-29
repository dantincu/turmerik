import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkAppIcon } from './trmrk-app-icon';

describe('TrmrkAppIcon', () => {
  let component: TrmrkAppIcon;
  let fixture: ComponentFixture<TrmrkAppIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkAppIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkAppIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
