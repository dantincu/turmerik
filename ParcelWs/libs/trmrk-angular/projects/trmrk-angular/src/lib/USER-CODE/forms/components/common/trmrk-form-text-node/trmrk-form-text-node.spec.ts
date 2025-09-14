import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkFormTextNode } from './trmrk-form-text-node';

describe('TrmrkFormTextNode', () => {
  let component: TrmrkFormTextNode;
  let fixture: ComponentFixture<TrmrkFormTextNode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkFormTextNode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkFormTextNode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
