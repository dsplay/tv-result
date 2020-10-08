import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutGamesComponent } from './layout-games.component';

describe('LayoutGamesComponent', () => {
  let component: LayoutGamesComponent;
  let fixture: ComponentFixture<LayoutGamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutGamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
