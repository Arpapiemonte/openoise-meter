import { TestBed } from '@angular/core/testing';

import { DatetimeService } from './datetime.service';

describe('DatetimeService', () => {
  let service: DatetimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatetimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
