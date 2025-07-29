import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkPanelList } from './trmrk-panel-list';

describe('TrmrkListView', () => {
  let component: TrmrkPanelList;
  let fixture: ComponentFixture<TrmrkPanelList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkPanelList],
    }).compileComponents();

    fixture = TestBed.createComponent(TrmrkPanelList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
