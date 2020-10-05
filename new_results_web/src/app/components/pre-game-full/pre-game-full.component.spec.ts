import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreGameFullComponent } from './pre-game-full.component';

describe('PreGameFullComponent', () => {
  let component: PreGameFullComponent;
  let fixture: ComponentFixture<PreGameFullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreGameFullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreGameFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
