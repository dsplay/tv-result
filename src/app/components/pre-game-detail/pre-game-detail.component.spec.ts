import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreGameDetailComponent } from './pre-game-detail.component';

describe('PreGameDetailComponent', () => {
  let component: PreGameDetailComponent;
  let fixture: ComponentFixture<PreGameDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreGameDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreGameDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
