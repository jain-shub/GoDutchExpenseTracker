import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Expense } from "app/model/expense.model";
import { UserRegistration } from "app/model/user-registartion.model";
import { ExpenseService } from "app/services/expense.service";
import { UtilityService } from "app/services/form-validation-utility.service";
import { UserService } from "app/services/user.service";
import { AlertService } from "../../services/alert.service";

/**
 * Add Expense Component Class. Add all the user expense between two users.
 *
 * @author goelsarthak
 */
@Component({
  selector: "app-add-expense",
  templateUrl: "./add-expense.component.html",
  styleUrls: ["./add-expense.component.scss"],
})
export class AddExpenseComponent implements OnInit {
  private http: HttpClient;
  user: UserRegistration;
  token: string;
  expenseList: Expense[] = [];
  expense: Expense = new Expense();
  expenseService: ExpenseService = new ExpenseService(this.http);
  userService: UserService;
  utility: UtilityService;
  selectedValue: string;
  type: string = "SPLIT";
  expenseType: string[] = ["SPLIT", "FULL", "CUSTOM"];

  formSubmitted = false;
  myForm: FormGroup;
  email: FormControl;
  expensename: FormControl;
  amount: FormControl;
  exptype: FormControl;
  toPerc: FormControl;
  fromPerc: FormControl;

  /**
   * Constructor
   *
   * @param userService
   * @param expenseService
   * @param UtilityService
   */
  constructor(
    utility: UtilityService,
    expenseService: ExpenseService,
    private router: Router,
    private alertService: AlertService,
    userService: UserService
  ) {
    this.expenseService = expenseService;
    this.userService = userService;
    this.utility = utility;
  }

  /**
   * Adding the custom validation for the add expense user form
   */
  ngOnInit(): void {
    this.email = new FormControl("", [
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
    ]);
    this.exptype = new FormControl("", Validators.required);
    this.expensename = new FormControl("", Validators.required);
    this.amount = new FormControl("", [
      Validators.required,
      Validators.pattern("[0-9]+(.[0-9][0-9]?)?"),
      Validators.min(1),
    ]);
    this.toPerc = new FormControl("50", [
      Validators.required,
      Validators.max(100),
      Validators.min(0),
    ]);
    this.fromPerc = new FormControl(
      "50",
      [Validators.required, Validators.max(100)],
      Validators.min[0]
    );
    this.myForm = new FormGroup({
      email: this.email,
      exptype: this.exptype,
      expensename: this.expensename,
      amount: this.amount,
      toPerc: this.toPerc,
      fromPerc: this.fromPerc,
    });
  }

  /**
   * Adding the user expense between two users on button click
   */
  addExpense() {
    let totalPercentage =
      parseInt(this.expense.fromUserSplitPercentageValue) +
      parseInt(this.expense.toUserSplitPercentageValue);
    if (totalPercentage === 100) {
      this.expenseService
        .addExpense(
          this.expense.toEmail,
          this.expense.name,
          this.expense.amount,
          this.type,
          this.expense.fromUserSplitPercentageValue,
          this.expense.toUserSplitPercentageValue
        )
        .subscribe(
          (data) => {
            this.expenseList.push(data);
            this.alertService.success("Expense Added Successful", true);
            this.close();
          },
          (error) => {
            this.alertService.error(
              "Can not add expense as 'To User' is not registered"
            );
          }
        );
      this.formSubmitted = true;
    } else {
      this.alertService.error(
        "The toPercentage & fromPercentage should be 100"
      );
    }
  }

  /**
   * Upon successfully adding the user expense, routing the control back to user dashboard
   */
  close() {
    this.router.navigate(["/user/dashboard/user-expense"]);
  }

  onExpenseTypeChange(val: any) {
    this.type = val;
  }
}
