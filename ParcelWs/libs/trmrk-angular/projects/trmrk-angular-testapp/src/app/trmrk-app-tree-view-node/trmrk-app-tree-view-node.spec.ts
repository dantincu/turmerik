import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkAppTreeViewNode } from './trmrk-app-tree-view-node';

describe('TrmrkTreeNode', () => {
  let component: TrmrkAppTreeViewNode;
  let fixture: ComponentFixture<TrmrkAppTreeViewNode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkAppTreeViewNode],
    }).compileComponents();

    fixture = TestBed.createComponent(TrmrkAppTreeViewNode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
