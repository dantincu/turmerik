import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkNumberEditorModalDialog } from './trmrk-number-editor-modal-dialog';

describe('TrmrkNumberEditorModalDialog', () => {
  let component: TrmrkNumberEditorModalDialog;
  let fixture: ComponentFixture<TrmrkNumberEditorModalDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkNumberEditorModalDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkNumberEditorModalDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
