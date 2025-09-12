import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkHomePage } from './trmrk-home-page';

describe('TrmrkHomePage', () => {
  let component: TrmrkHomePage;
  let fixture: ComponentFixture<TrmrkHomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkHomePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
