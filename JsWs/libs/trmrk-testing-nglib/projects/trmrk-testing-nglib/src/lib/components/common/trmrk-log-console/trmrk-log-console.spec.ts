import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkLogConsole } from './trmrk-log-console';

describe('TrmrkLogConsole', () => {
  let component: TrmrkLogConsole;
  let fixture: ComponentFixture<TrmrkLogConsole>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkLogConsole]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkLogConsole);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
