import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkFolderPage } from './trmrk-folder-page';

describe('TrmrkFolderPage', () => {
  let component: TrmrkFolderPage;
  let fixture: ComponentFixture<TrmrkFolderPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkFolderPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkFolderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
