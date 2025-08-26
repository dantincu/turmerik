import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkAppPage } from './trmrk-app-page';

describe('TrmrkAppPage', () => {
  let component: TrmrkAppPage;
  let fixture: ComponentFixture<TrmrkAppPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkAppPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
