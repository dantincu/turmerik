import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkTreeView } from './trmrk-tree-view';

describe('TrmrkTreeView', () => {
  let component: TrmrkTreeView;
  let fixture: ComponentFixture<TrmrkTreeView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkTreeView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkTreeView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
