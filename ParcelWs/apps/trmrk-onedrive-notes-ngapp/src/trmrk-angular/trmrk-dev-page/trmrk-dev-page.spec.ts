import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkDevPage } from './trmrk-dev-page';

describe('TrmrkDevPage', () => {
  let component: TrmrkDevPage;
  let fixture: ComponentFixture<TrmrkDevPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkDevPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkDevPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
