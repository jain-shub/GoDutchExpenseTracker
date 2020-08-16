import { Component, OnInit } from "@angular/core";
import { FormArray, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { Expense } from "../../model/expense.model";
import { ExpenseService } from "../../services/expense.service";
import { UserService } from "../../services/user.service";
import { AlertService } from "../../services/alert.service";

/**
 * Get Expense Component Class. Get/Edit/Update all the user expense between two users.
 *
 * @author goelsarthak
 */
@Component({
  selector: "app-get-expense",
  templateUrl: "./get-expense.component.html",
  styleUrls: ["./get-expense.component.scss"],
})
export class GetExpenseComponent implements OnInit {
  userExpenseList: Expense[];
  amountOwes: Expense[] = [];
  amountOwedBy: Expense[] = [];
  userExpense: Expense;
  address: string;
  loggedUserName: string;
  type: string = "SPLIT";
  expenseType: string[] = ["SPLIT", "FULL", "CUSTOM"];
  dataSource = this.userExpenseList;
  totalAmountOwed: number = 0;
  totalAmountOwes: number = 0;

  /**
   * Constructor
   *
   * @param userService
   * @param expenseService
   * @param alertService
   */
  constructor(
    private router: Router,
    private expenseService: ExpenseService,
    private userService: UserService,
    private alertService: AlertService
  ) {}

  controls: FormArray;

  /**
   * Adding the custom validation for the get expense
   */
  ngOnInit(): void {
    this.expenseService.refreshNeeded$.subscribe(() => {
      //  this.getAllExpenses();
    });
    this.getAllExpenses();
  }

  /**
   * Method to call the service method to get all the individual expenses of the user
   */
  getAllExpenses() {
    this.expenseService.getExpense().subscribe((data) => {
      this.userExpenseList = null;
      this.userExpenseList = data;
      this.computeExpenses();
    });
  }

  getControl(index: number, field: string): FormControl {
    return this.controls.at(index).get(field) as FormControl;
  }

  /**
   * Method to call the service method to delete the individual expense of the user
   */
  deleteExpense(expense: Expense) {
    this.expenseService.delete(expense.id).subscribe(
      (data) => {
        alert("deleted successfuly");
        this.router.navigate(["/user/dashboard/redirect", "user"]);
      },
      (error) => {
        alert(error);
      }
    );
  }

  /**
   * Method to call the service method to update all the individual expense of the user
   */
  updateRowData(expense: Expense) {
    expense.type = this.type;
    let index = this.type.localeCompare("SPLIT");
    let flag = 0;
    if (this.type.localeCompare("SPLIT") == 0) {
      expense.fromUserSplitPercentageValue = "50";
      expense.toUserSplitPercentageValue = "50";
      flag = 1;
    }
    if (this.type.localeCompare("FULL") == 0) {
      expense.fromUserSplitPercentageValue = "100";
      expense.toUserSplitPercentageValue = "0";
      flag = 1;
    }
    if (this.type.localeCompare("CUSTOM") == 0) {
      let total: number =
        Number(expense.fromUserSplitPercentageValue) +
        Number(expense.toUserSplitPercentageValue);
      if (total === 100) {
        flag = 1;
      }
    }
    if (flag === 1) {
      this.expenseService.update(expense).subscribe(
        (data) => {
          alert("Updated successfuly");
        },
        (error) => {
          this.alertService.error(
            "The split percentage between 2 users should be 100"
          );
          alert(error);
        }
      );
    } else {
      this.alertService.error("Please enter the correct values");
      alert("Please enter correct values");
      this.router.navigate(["/user/dashboard/redirect", "user"]);
    }
  }

  /**
   * Method to call the service method to to seperate out the due amount & owed amount
   */
  computeExpenses() {
    const loggedUser = localStorage.getItem("currentUser");
    let splitted = loggedUser.split(",");
    Object.keys(splitted).forEach((key) => {
      let val = splitted[key].replace(/"/g, " ");
      if (val.includes("firstName")) {
        var fname = val.split(":")[1].replace(/\s/g, "");
        this.loggedUserName = fname + " ";
      }
      if (val.includes("lastName")) {
        var lname = val.split(":")[1].replace(/\s/g, "");
        this.loggedUserName = this.loggedUserName.concat(lname);
      }
      if (val.includes("email")) {
        let emailAddress = val.split(":");
        this.address = emailAddress[1];
      }
    });

    this.userService.getUser().subscribe((data) => {
      this.totalAmountOwed = this.totalAmountOwed + data?.amountOwed;
      this.totalAmountOwes = this.totalAmountOwes + data?.amountDue;
    });

    let n = this.userExpenseList.length;
    for (let i = 0; i < n; i++) {
      if (this.userExpenseList[i]) {
        let index = this.userExpenseList[i].fromUserName.localeCompare(
          this.loggedUserName
        );
        if (index == 0) {
          this.amountOwedBy.push(this.userExpenseList[i]);
        } else {
          this.amountOwes.push(this.userExpenseList[i]);
        }
      }
    }
  }

  onExpenseTypeChange(val: any) {
    this.type = val;
  }
}
