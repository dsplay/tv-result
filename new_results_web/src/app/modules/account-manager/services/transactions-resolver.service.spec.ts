import { TestBed } from '@angular/core/testing';

import { TransactionsResolverService } from './transactions-resolver.service';

describe('TransactionsResolverService', () => {
  let service: TransactionsResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionsResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
