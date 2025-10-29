import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkPaginatedList } from './trmrk-paginated-list';

describe('TrmrkPaginatedList', () => {
  let component: TrmrkPaginatedList;
  let fixture: ComponentFixture<TrmrkPaginatedList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkPaginatedList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkPaginatedList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
