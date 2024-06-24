import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkNgBrowserComponent } from './trmrk-ng-browser.component';

describe('TrmrkNgBrowserComponent', () => {
  let component: TrmrkNgBrowserComponent;
  let fixture: ComponentFixture<TrmrkNgBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkNgBrowserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkNgBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
