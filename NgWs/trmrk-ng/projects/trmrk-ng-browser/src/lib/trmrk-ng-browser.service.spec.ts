import { TestBed } from '@angular/core/testing';

import { TrmrkNgBrowserService } from './trmrk-ng-browser.service';

describe('TrmrkNgBrowserService', () => {
  let service: TrmrkNgBrowserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrmrkNgBrowserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
