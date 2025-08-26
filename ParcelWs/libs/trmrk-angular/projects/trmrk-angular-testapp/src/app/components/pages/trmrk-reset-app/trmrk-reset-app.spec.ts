import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkResetApp } from './trmrk-reset-app';

describe('TrmrkResetApp', () => {
  let component: TrmrkResetApp;
  let fixture: ComponentFixture<TrmrkResetApp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkResetApp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkResetApp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
