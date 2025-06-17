import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkAppHorizStrip } from './trmrk-app-horiz-strip';

describe('TrmrkAppHorizStrip', () => {
  let component: TrmrkAppHorizStrip;
  let fixture: ComponentFixture<TrmrkAppHorizStrip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkAppHorizStrip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkAppHorizStrip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
