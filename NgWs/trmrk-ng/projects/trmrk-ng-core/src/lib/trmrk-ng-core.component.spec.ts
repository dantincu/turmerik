import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkNgCoreComponent } from './trmrk-ng-core.component';

describe('TrmrkNgCoreComponent', () => {
  let component: TrmrkNgCoreComponent;
  let fixture: ComponentFixture<TrmrkNgCoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkNgCoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkNgCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
