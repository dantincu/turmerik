import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkTreeNode } from './trmrk-tree-node';

describe('TrmrkTreeNode', () => {
  let component: TrmrkTreeNode;
  let fixture: ComponentFixture<TrmrkTreeNode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkTreeNode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkTreeNode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
