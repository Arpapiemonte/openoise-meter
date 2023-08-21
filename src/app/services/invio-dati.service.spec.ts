import { TestBed } from '@angular/core/testing';

import { InvioDatiService } from './invio-dati.service';

describe('InvioDatiService', () => {
  let service: InvioDatiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvioDatiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
