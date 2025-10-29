import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkResetAppDialog } from './trmrk-reset-app-dialog';

describe('TrmrkResetAppDialog', () => {
  let component: TrmrkResetAppDialog;
  let fixture: ComponentFixture<TrmrkResetAppDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkResetAppDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkResetAppDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
