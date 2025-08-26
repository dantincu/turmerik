import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkAppTreePage } from './trmrk-app-tree-page';

describe('TrmrkAppTreePage', () => {
  let component: TrmrkAppTreePage;
  let fixture: ComponentFixture<TrmrkAppTreePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkAppTreePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkAppTreePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
