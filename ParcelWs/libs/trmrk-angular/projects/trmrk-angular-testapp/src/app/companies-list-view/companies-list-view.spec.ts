import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesListView } from './companies-list-view';

describe('CompaniesListView', () => {
  let component: CompaniesListView;
  let fixture: ComponentFixture<CompaniesListView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompaniesListView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompaniesListView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
