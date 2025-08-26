import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkButtonsPage } from './trmrk-buttons-page';

describe('TrmrkButtonsPage', () => {
  let component: TrmrkButtonsPage;
  let fixture: ComponentFixture<TrmrkButtonsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkButtonsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkButtonsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
