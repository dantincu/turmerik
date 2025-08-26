import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkCompaniesPanelPage } from './trmrk-companies-panel-page';

describe('TrmrkCompaniesPanelPage', () => {
  let component: TrmrkCompaniesPanelPage;
  let fixture: ComponentFixture<TrmrkCompaniesPanelPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkCompaniesPanelPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkCompaniesPanelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
