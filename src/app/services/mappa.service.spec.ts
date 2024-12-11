import { TestBed } from '@angular/core/testing';

import { MappaService } from './mappa.service';

describe('MappaService', () => {
  let service: MappaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MappaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
