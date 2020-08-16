import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetExpenseComponent } from './get-expense.component';

describe('GetExpenseComponent', () => {
  let component: GetExpenseComponent;
  let fixture: ComponentFixture<GetExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
