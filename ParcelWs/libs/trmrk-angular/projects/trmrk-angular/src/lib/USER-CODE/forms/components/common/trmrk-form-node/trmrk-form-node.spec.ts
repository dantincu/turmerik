import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkFormNode } from './trmrk-form-node';

describe('TrmrkFormNode', () => {
  let component: TrmrkFormNode;
  let fixture: ComponentFixture<TrmrkFormNode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkFormNode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkFormNode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
