import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkRgbEditorModalDialog } from './trmrk-rgb-editor-modal-dialog';

describe('TrmrkRgbEditorModalDialog', () => {
  let component: TrmrkRgbEditorModalDialog;
  let fixture: ComponentFixture<TrmrkRgbEditorModalDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkRgbEditorModalDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkRgbEditorModalDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
