import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesListViewContainer } from './companies-list-view-container';

describe('CompaniesListViewContainer', () => {
  let component: CompaniesListViewContainer;
  let fixture: ComponentFixture<CompaniesListViewContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompaniesListViewContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompaniesListViewContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
