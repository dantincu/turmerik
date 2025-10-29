import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkHorizStripsPage } from './trmrk-horiz-strips-page';

describe('TrmrkHorizStripsPage', () => {
  let component: TrmrkHorizStripsPage;
  let fixture: ComponentFixture<TrmrkHorizStripsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkHorizStripsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkHorizStripsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
