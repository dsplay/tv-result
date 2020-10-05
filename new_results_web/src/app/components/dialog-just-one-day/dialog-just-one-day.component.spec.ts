import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogJustOneDayComponent } from './dialog-just-one-day.component';

describe('DialogJustOneDayComponent', () => {
  let component: DialogJustOneDayComponent;
  let fixture: ComponentFixture<DialogJustOneDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogJustOneDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogJustOneDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
