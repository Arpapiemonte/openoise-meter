import { TestBed } from '@angular/core/testing';

import { ColorModeService } from './color-mode.service';

describe('ColorModeService', () => {
  let service: ColorModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
