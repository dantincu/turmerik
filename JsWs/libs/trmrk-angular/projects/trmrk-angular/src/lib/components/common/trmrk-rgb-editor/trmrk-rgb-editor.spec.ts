import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkRgbEditor } from './trmrk-rgb-editor';

describe('TrmrkRgbEditor', () => {
  let component: TrmrkRgbEditor;
  let fixture: ComponentFixture<TrmrkRgbEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkRgbEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkRgbEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
