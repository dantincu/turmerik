import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkDateTimeEditor } from './trmrk-date-time-editor';

describe('TrmrkDateTimeEditor', () => {
  let component: TrmrkDateTimeEditor;
  let fixture: ComponentFixture<TrmrkDateTimeEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkDateTimeEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkDateTimeEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
