import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkShortStringEditor } from './trmrk-short-string-editor';

describe('TrmrkShortStringEditor', () => {
  let component: TrmrkShortStringEditor;
  let fixture: ComponentFixture<TrmrkShortStringEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkShortStringEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkShortStringEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
