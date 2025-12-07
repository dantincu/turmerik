import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkNumberEditorsTestPage } from './trmrk-number-editors-test-page';

describe('TrmrkNumberEditorsTestPage', () => {
  let component: TrmrkNumberEditorsTestPage;
  let fixture: ComponentFixture<TrmrkNumberEditorsTestPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkNumberEditorsTestPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkNumberEditorsTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
