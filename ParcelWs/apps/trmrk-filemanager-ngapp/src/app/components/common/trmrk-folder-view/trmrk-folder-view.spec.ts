import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkFolderView } from './trmrk-folder-view';

describe('TrmrkFolderView', () => {
  let component: TrmrkFolderView;
  let fixture: ComponentFixture<TrmrkFolderView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkFolderView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkFolderView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
