import { TestBed } from '@angular/core/testing';

import { ResetPasswordResolverService } from './reset-password-resolver.service';

describe('ResetPasswordResolverService', () => {
  let service: ResetPasswordResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResetPasswordResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
