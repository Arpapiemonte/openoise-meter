import { TestBed } from '@angular/core/testing';

import { GraficiService } from './grafici.service';

describe('GraficiService', () => {
  let service: GraficiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraficiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
