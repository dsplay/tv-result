import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddAccountComponent } from './modal-add-account.component';

describe('ModalAddAccountComponent', () => {
  let component: ModalAddAccountComponent;
  let fixture: ComponentFixture<ModalAddAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
