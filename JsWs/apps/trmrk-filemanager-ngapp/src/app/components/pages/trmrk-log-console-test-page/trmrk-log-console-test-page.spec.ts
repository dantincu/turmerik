import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkLogConsoleTestPage } from './trmrk-log-console-test-page';

describe('TrmrkLogConsoleTestPage', () => {
  let component: TrmrkLogConsoleTestPage;
  let fixture: ComponentFixture<TrmrkLogConsoleTestPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkLogConsoleTestPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkLogConsoleTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
