import { TestBed } from '@angular/core/testing';

import { VariabiliService } from './variabili.service';

describe('VariabiliService', () => {
  let service: VariabiliService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VariabiliService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
