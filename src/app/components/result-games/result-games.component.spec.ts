import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultGamesComponent } from './result-games.component';

describe('ResultGamesComponent', () => {
  let component: ResultGamesComponent;
  let fixture: ComponentFixture<ResultGamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultGamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
