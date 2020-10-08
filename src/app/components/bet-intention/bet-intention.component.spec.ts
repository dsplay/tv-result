import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetIntentionComponent } from './bet-intention.component';

describe('BetIntentionComponent', () => {
  let component: BetIntentionComponent;
  let fixture: ComponentFixture<BetIntentionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetIntentionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetIntentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
