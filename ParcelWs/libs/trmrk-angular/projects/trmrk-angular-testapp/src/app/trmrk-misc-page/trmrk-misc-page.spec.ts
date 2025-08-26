import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkMiscPage } from './trmrk-misc-page';

describe('TrmrkMiscPage', () => {
  let component: TrmrkMiscPage;
  let fixture: ComponentFixture<TrmrkMiscPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkMiscPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkMiscPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
