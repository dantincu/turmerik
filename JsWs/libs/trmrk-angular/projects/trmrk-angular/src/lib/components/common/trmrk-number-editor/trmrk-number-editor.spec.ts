import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkNumberEditor } from './trmrk-number-editor';

describe('TrmrkNumberEditor', () => {
  let component: TrmrkNumberEditor;
  let fixture: ComponentFixture<TrmrkNumberEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkNumberEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkNumberEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
