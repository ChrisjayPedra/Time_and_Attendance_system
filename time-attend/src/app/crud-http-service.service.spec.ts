import { TestBed } from '@angular/core/testing';

import { CrudHttpServiceService } from './crud-http-service.service';

describe('CrudHttpServiceService', () => {
  let service: CrudHttpServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudHttpServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
