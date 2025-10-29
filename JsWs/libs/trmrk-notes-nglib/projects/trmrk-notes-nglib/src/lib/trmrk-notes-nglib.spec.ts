import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkNotesNglib } from './trmrk-notes-nglib';

describe('TrmrkNotesNglib', () => {
  let component: TrmrkNotesNglib;
  let fixture: ComponentFixture<TrmrkNotesNglib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkNotesNglib]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkNotesNglib);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
