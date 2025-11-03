import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkLogMsgObjTree } from './trmrk-log-msg-obj-tree';

describe('TrmrkLogMsgObjTree', () => {
  let component: TrmrkLogMsgObjTree;
  let fixture: ComponentFixture<TrmrkLogMsgObjTree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkLogMsgObjTree]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkLogMsgObjTree);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
