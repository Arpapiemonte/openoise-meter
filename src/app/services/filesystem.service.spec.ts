import { TestBed } from '@angular/core/testing';

import { FilesystemService } from './filesystem.service';

describe('FilesystemService', () => {
  let service: FilesystemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilesystemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
