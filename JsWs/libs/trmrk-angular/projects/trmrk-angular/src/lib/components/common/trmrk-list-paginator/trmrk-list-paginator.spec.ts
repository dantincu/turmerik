import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkListPager } from './trmrk-list-paginator';

describe('TrmrkListPager', () => {
  let component: TrmrkListPager;
  let fixture: ComponentFixture<TrmrkListPager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkListPager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkListPager);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
