import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSportTournamentsComponent } from './menu-sport-tournaments.component';

describe('MenuSportTournamentsComponent', () => {
  let component: MenuSportTournamentsComponent;
  let fixture: ComponentFixture<MenuSportTournamentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuSportTournamentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuSportTournamentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
