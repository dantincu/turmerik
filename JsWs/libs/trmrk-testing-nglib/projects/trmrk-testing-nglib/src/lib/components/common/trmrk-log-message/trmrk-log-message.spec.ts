import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkLogMessage } from './trmrk-log-message';

describe('TrmrkLogMessage', () => {
  let component: TrmrkLogMessage;
  let fixture: ComponentFixture<TrmrkLogMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkLogMessage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkLogMessage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
