import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkUserMessage } from './trmrk-user-message';

describe('TrmrkUserMessage', () => {
  let component: TrmrkUserMessage;
  let fixture: ComponentFixture<TrmrkUserMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkUserMessage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkUserMessage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
