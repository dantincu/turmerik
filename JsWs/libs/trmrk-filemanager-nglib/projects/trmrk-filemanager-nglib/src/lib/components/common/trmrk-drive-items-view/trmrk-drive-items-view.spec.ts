import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkDriveItemsView } from './trmrk-drive-items-view';

describe('TrmrkDriveItemsView', () => {
  let component: TrmrkDriveItemsView;
  let fixture: ComponentFixture<TrmrkDriveItemsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkDriveItemsView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkDriveItemsView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
