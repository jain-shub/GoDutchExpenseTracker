import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetGroupExpenseComponent } from './get-group-expense.component';

describe('GetGroupExpenseComponent', () => {
  let component: GetGroupExpenseComponent;
  let fixture: ComponentFixture<GetGroupExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetGroupExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetGroupExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
