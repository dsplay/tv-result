import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreMakeBetComponent } from './pre-make-bet.component';

describe('PreMakeBetComponent', () => {
  let component: PreMakeBetComponent;
  let fixture: ComponentFixture<PreMakeBetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreMakeBetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreMakeBetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
