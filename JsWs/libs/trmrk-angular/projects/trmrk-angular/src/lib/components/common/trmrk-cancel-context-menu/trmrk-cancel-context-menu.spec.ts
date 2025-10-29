import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkCancelContextMenu } from './trmrk-cancel-context-menu';

describe('TrmrkCancelContextMenu', () => {
  let component: TrmrkCancelContextMenu;
  let fixture: ComponentFixture<TrmrkCancelContextMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkCancelContextMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkCancelContextMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
