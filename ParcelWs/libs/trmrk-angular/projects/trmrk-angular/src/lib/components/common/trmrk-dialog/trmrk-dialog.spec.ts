import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkDialog } from './trmrk-dialog';

describe('TrmrkDialog', () => {
  let component: TrmrkDialog;
  let fixture: ComponentFixture<TrmrkDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
