import { TestBed } from '@angular/core/testing';

import { FeedbackResolverService } from './feedback-resolver.service';

describe('FeedbackResolverService', () => {
  let service: FeedbackResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedbackResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
