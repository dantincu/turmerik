import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkUserMessages } from './trmrk-user-messages';

describe('TrmrkUserMessages', () => {
  let component: TrmrkUserMessages;
  let fixture: ComponentFixture<TrmrkUserMessages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkUserMessages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkUserMessages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
