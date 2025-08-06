import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkAppThemesListView } from './trmrk-app-themes-list-view';

describe('TrmrkAppThemesListView', () => {
  let component: TrmrkAppThemesListView;
  let fixture: ComponentFixture<TrmrkAppThemesListView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkAppThemesListView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkAppThemesListView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
