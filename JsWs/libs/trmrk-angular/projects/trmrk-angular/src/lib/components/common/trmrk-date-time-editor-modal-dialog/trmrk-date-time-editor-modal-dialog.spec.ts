import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkDateTimeEditorModalDialog } from './trmrk-date-time-editor-modal-dialog';

describe('TrmrkDateTimeEditorModalDialog', () => {
  let component: TrmrkDateTimeEditorModalDialog;
  let fixture: ComponentFixture<TrmrkDateTimeEditorModalDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkDateTimeEditorModalDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkDateTimeEditorModalDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
