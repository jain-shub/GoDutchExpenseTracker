import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { GroupExpense } from "app/model/group-expense.model";
import { Group } from "app/model/group.model";
import { UserRegistration } from "app/model/user-registartion.model";
import { AlertService } from "app/services/alert.service";
import { UtilityService } from "app/services/form-validation-utility.service";
import { GroupExpenseService } from "app/services/group-expense.service";
import { GroupService } from "app/services/group.service";

/**
 * Component class for the Add Group Expense Component.
 *
 * @author jain-shub
 */
@Component({
  selector: "app-add-group-expense",
  templateUrl: "./add-group-expense.component.html",
  styleUrls: ["./add-group-expense.component.scss"],
})
export class AddGroupExpenseComponent implements OnInit {
  token: string;
  expenseList: GroupExpense[] = [];
  groupExpense: GroupExpense;
  paidByVal: string;
  memberShares: Map<string, number>;
  mems: any[][] = [];
  memEmail: Array<string>;
  ratio: number;
  user: UserRegistration;
  percentJson: any;
  totalError: boolean;
  totalErrorMsg: string = "";
  viewedGroup: Group;
  step = 0;
  total = 0;
  groupID: any;

  utility: UtilityService;

  /**
   * Constructor.
   */
  constructor(
    private groupService: GroupService,
    private groupExpenseService: GroupExpenseService,
    private alertService: AlertService,
    private activatedroute: ActivatedRoute,
    utility: UtilityService,
    private router: Router
  ) {
    this.utility = utility;
    this.ratio = 0;
    this.user = JSON.parse(localStorage.getItem("currentUser"));
    this.groupExpense = new GroupExpense();
    this.viewedGroup = new Group();
  }

  /**
   * initializing value for group id and other prefetched values
   */
  ngOnInit(): void {
    this.activatedroute.params.subscribe((params) => {
      this.groupID = params["id"];
    });
    this.getValuesFromGroup();
  }

  /**
   * Adding a new group expense
   */
  addGroupExpense() {
    if (this.groupExpense.name && this.groupExpense.amount) {
      this.percentJson = this.onValChange();
      this.groupExpenseService
        .addGroupExpense(
          this.groupExpense.name,
          this.viewedGroup.id,
          this.groupExpense.amount,
          this.percentJson,
          this.groupExpense.paidBy,
          this.groupExpense.createdBy
        )
        .subscribe(
          (data) => {
            this.expenseList.push(data);
            this.alertService.success("Expense Added Successful", true);
            this.close();
          },
          (error) => {
            this.alertService.error(error);
          }
        );
    } else {
      this.alertService.error("Please adhere to expense details validations");
    }
  }

  /**
   * Performing actions for posting request
   */
  onValChange() {
    let jsonObject = {};
    let total = 0;
    this.mems.map((items) => {
      this.groupExpense.dividePercentage.set(items[0].id, items[1] / 100);
    });
    this.groupExpense.dividePercentage.forEach(function (value, key) {
      total = total + value;
    });
    if (total !== 1) {
      this.alertService.error("Sum of all ratios should be 100");
      this.totalError = true;
      this.totalErrorMsg = "Sum of all ratios should be 100";
      return null;
    }
    this.groupExpense.dividePercentage.forEach((value, key) => {
      jsonObject[key] = value;
    });

    return jsonObject;
  }

  /**
   * getting values from group
   */
  getValuesFromGroup() {
    this.groupExpense.createdBy =
      this.user.firstName + " " + this.user.lastName;
    this.groupService.getGroupById(this.groupID).subscribe((data) => {
      this.viewedGroup = data;
      data.members.forEach((element) => {
        this.mems.push([element, this.ratio]);
      });
    });
  }

  /**
   * actions for expantion panel
   */
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  /**
   * closing the tab
   */
  close() {
    this.router.navigate(["/user/dashboard/user-expense"]);
  }

  onPaidByChange(val: any) {
    this.groupExpense.paidBy = val;
  }

  /**
   * Performing calculations on mapping
   */
  onPercentChange() {
    this.mems.map((items) => {
      this.total += items[1];
    });
  }

  /**
   * validating total amount
   */
  totalValidator(group: FormGroup) {
    let sum = 0;
    return sum === 100 ? { notValid: true } : null;
  }
}
