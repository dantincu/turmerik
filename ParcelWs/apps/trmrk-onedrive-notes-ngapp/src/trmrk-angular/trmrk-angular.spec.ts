import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkAngular } from './trmrk-angular';

describe('TrmrkAngular', () => {
  let component: TrmrkAngular;
  let fixture: ComponentFixture<TrmrkAngular>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkAngular]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkAngular);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
