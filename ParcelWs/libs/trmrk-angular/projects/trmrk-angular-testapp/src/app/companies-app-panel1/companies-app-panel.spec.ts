import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesAppPanel } from './companies-app-panel';

describe('CompaniesListView', () => {
  let component: CompaniesAppPanel;
  let fixture: ComponentFixture<CompaniesAppPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompaniesAppPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(CompaniesAppPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
