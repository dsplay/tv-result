import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCheckBetComponent } from './dialog-check-bet.component';

describe('DialogCheckBetComponent', () => {
  let component: DialogCheckBetComponent;
  let fixture: ComponentFixture<DialogCheckBetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCheckBetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCheckBetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
