import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkListAppPanel } from './trmrk-list-app-panel';

describe('TrmrkListAppPanel', () => {
  let component: TrmrkListAppPanel;
  let fixture: ComponentFixture<TrmrkListAppPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkListAppPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkListAppPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
