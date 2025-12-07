import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkPaginatedListPage } from './trmrk-paginated-list-page';

describe('TrmrkPaginatedListPage', () => {
  let component: TrmrkPaginatedListPage;
  let fixture: ComponentFixture<TrmrkPaginatedListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkPaginatedListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkPaginatedListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
