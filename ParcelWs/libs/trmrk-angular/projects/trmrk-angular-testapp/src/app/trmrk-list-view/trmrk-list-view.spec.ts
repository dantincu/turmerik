import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkListView } from './trmrk-list-view';

describe('TrmrkListView', () => {
  let component: TrmrkListView;
  let fixture: ComponentFixture<TrmrkListView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkListView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkListView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
