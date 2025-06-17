import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkAppBar } from './trmrk-app-bar';

describe('TrmrkAppBar', () => {
  let component: TrmrkAppBar;
  let fixture: ComponentFixture<TrmrkAppBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkAppBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkAppBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
