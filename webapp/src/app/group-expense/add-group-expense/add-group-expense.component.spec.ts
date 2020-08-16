import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupExpenseComponent } from './add-group-expense.component';

describe('AddGroupExpenseComponent', () => {
  let component: AddGroupExpenseComponent;
  let fixture: ComponentFixture<AddGroupExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGroupExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGroupExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
