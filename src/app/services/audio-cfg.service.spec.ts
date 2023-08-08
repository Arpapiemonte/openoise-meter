import { TestBed } from '@angular/core/testing';

import { AudioCfgService } from './audio-cfg.service';

describe('AudioCfgService', () => {
  let service: AudioCfgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioCfgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
