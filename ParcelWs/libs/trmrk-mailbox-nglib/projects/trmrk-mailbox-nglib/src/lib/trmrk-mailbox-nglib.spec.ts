import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkMailboxNglib } from './trmrk-mailbox-nglib';

describe('TrmrkMailboxNglib', () => {
  let component: TrmrkMailboxNglib;
  let fixture: ComponentFixture<TrmrkMailboxNglib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkMailboxNglib]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkMailboxNglib);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
