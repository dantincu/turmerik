import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkLogMsgObjTreeNode } from './trmrk-log-msg-obj-tree-node';

describe('TrmrkLogMsgObjTreeNode', () => {
  let component: TrmrkLogMsgObjTreeNode;
  let fixture: ComponentFixture<TrmrkLogMsgObjTreeNode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkLogMsgObjTreeNode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkLogMsgObjTreeNode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
