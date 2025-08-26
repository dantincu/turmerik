import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkPanelListItem } from './trmrk-panel-list-item';

describe('TrmrkPanelListItem', () => {
  let component: TrmrkPanelListItem;
  let fixture: ComponentFixture<TrmrkPanelListItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkPanelListItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkPanelListItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
