import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkDeleteAppCacheDialog } from './trmrk-delete-app-cache-dialog';

describe('TrmrkResetAppDialog', () => {
  let component: TrmrkDeleteAppCacheDialog;
  let fixture: ComponentFixture<TrmrkDeleteAppCacheDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkDeleteAppCacheDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(TrmrkDeleteAppCacheDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
