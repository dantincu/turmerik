import { TestBed } from '@angular/core/testing';

import { TrmrkNgCoreService } from './trmrk-ng-core.service';

describe('TrmrkNgCoreService', () => {
  let service: TrmrkNgCoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrmrkNgCoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
