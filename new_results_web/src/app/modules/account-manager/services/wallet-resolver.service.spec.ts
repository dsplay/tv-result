import { TestBed } from '@angular/core/testing';

import { WalletResolverService } from './wallet-resolver.service';

describe('WalletResolverService', () => {
  let service: WalletResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
