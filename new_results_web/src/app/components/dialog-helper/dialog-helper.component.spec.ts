import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHelperComponent } from './dialog-helper.component';

describe('DialogHelperComponent', () => {
  let component: DialogHelperComponent;
  let fixture: ComponentFixture<DialogHelperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogHelperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
