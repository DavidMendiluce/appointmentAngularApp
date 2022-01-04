import { TestBed } from '@angular/core/testing';

import { LocationsServiceService } from './locations-service.service';

describe('LocationsServiceService', () => {
  let service: LocationsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
