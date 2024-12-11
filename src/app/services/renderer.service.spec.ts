import { TestBed } from '@angular/core/testing';

import { RendererService } from './renderer.service';

describe('RendererService', () => {
  let service: RendererService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RendererService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
