import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHelperRatesComponent } from './table-helper-rates.component';

describe('TableHelperRatesComponent', () => {
  let component: TableHelperRatesComponent;
  let fixture: ComponentFixture<TableHelperRatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableHelperRatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableHelperRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
