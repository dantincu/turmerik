import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkCompaniesAppPanel } from './trmrk-companies-app-panel';

describe('CompaniesListView', () => {
  let component: TrmrkCompaniesAppPanel;
  let fixture: ComponentFixture<TrmrkCompaniesAppPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkCompaniesAppPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(TrmrkCompaniesAppPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
