import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexedDbBrowser } from './indexed-db-browser';

describe('IndexedDbBrowser', () => {
  let component: IndexedDbBrowser;
  let fixture: ComponentFixture<IndexedDbBrowser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexedDbBrowser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexedDbBrowser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
