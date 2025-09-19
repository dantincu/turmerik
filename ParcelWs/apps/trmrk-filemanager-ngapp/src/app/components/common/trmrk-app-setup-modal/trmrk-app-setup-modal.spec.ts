import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkAppSetupModal } from './trmrk-app-setup-modal';

describe('TrmrkAppSetupModal', () => {
  let component: TrmrkAppSetupModal;
  let fixture: ComponentFixture<TrmrkAppSetupModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkAppSetupModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkAppSetupModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
