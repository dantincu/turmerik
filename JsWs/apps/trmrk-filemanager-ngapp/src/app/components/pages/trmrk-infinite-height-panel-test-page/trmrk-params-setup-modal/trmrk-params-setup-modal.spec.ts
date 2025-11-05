import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkParamsSetupModal } from './trmrk-params-setup-modal';

describe('TrmrkParamsSetupModal', () => {
  let component: TrmrkParamsSetupModal;
  let fixture: ComponentFixture<TrmrkParamsSetupModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkParamsSetupModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkParamsSetupModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
