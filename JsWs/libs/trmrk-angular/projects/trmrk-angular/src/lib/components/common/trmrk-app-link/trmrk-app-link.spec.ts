import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkAppLink } from './trmrk-app-link';

describe('TrmrkAppLink', () => {
  let component: TrmrkAppLink;
  let fixture: ComponentFixture<TrmrkAppLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkAppLink]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkAppLink);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
