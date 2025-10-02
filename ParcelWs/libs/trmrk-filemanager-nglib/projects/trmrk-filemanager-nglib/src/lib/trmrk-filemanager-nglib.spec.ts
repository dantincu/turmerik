import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkFilemanagerNglib } from './trmrk-filemanager-nglib';

describe('TrmrkFilemanagerNglib', () => {
  let component: TrmrkFilemanagerNglib;
  let fixture: ComponentFixture<TrmrkFilemanagerNglib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkFilemanagerNglib]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkFilemanagerNglib);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
