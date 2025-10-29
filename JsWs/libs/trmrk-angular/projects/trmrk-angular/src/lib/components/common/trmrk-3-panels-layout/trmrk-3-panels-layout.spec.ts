import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trmrk3PanelsLayout } from './trmrk-3-panels-layout';

describe('Trmrk3PanelsLayout', () => {
  let component: Trmrk3PanelsLayout;
  let fixture: ComponentFixture<Trmrk3PanelsLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Trmrk3PanelsLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Trmrk3PanelsLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
