import { SettleComponent } from './../settle/settle.component';
import { Settle } from './../../model/settle.model';
import { AlertService } from './../../services/alert.service';
import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { GroupExpense } from "app/model/group-expense.model";
import { UserRegistration } from "app/model/user-registartion.model";
import { UtilityService } from "app/services/form-validation-utility.service";
import { Group } from "app/model/group.model";
import { SELECT_PANEL_INDENT_PADDING_X } from '@angular/material/select';
import { GroupExpenseService } from "app/services/group-expense.service";
import { GroupService } from "app/services/group.service";
import { UserService } from "app/services/user.service";
import { UpdateUserComponent } from 'app/user/update-user/update-user.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

/**
 * Component class for the Get Group Expense Component.
 *
 * @author jain-shub
 */
@Component({
  selector: "app-get-group-expense",
  templateUrl: "./get-group-expense.component.html",
  styleUrls: ["./get-group-expense.component.scss"],
})
export class GetGroupExpenseComponent implements OnInit {
  form: FormGroup;
  groupExpenseList: GroupExpense[] = [];
  total: number;
  ratio: number;
  step = 0;
  utility: UtilityService;
  percVal: any[][] = [];
  groupUpd: any[][] = [];
  totalAmount: number;
  currentGroup: Group;
  groupSettledExpenseList: GroupExpense[] = [];
  groupID: any;
  user: UserRegistration;
  totalValueMap = new Map<object, number>();
  settle: Settle;
  data: any;

  /**
   * Constructor.
   */
  constructor(
    private router: Router,
    private groupExpenseService: GroupExpenseService,
    private alertService: AlertService,
    private groupService: GroupService,
    utility: UtilityService,
    private activatedroute: ActivatedRoute,
    private userService: UserService,
    private dialog: MatDialog
  ) {
    this.ratio = 0;
    this.utility = utility;
  }

  ngOnInit(): void {
    this.initTask();
  }

  /**
   * Performing initialization
   */
  initTask() {
    this.activatedroute.params.subscribe((params) => {
      this.groupID = params["id"];
    });
    let member: UserRegistration[];
    let currentGroup: Group;
    this.groupService.getGroupById(this.groupID).subscribe(
      (item) => {
        member = item.members;
        this.currentGroup = item;
      },
      (error) => {
      }
    );
    this.groupExpenseService.getTotalOfGroup(this.groupID).subscribe((item) => {
      this.expenseSettlement(item);
      this.total = item?.total;
    });
    this.groupExpenseService.getExpense(this.groupID).subscribe((data) => {
      data.forEach((elem) => this.listDividePercent(elem, member));
    });

    // this.groupExpenseService
    //   .getSettledExpenses(this.groupID)
    //   .subscribe((item) => {
    //     item.forEach((elem) => this.displaySettledExpenses(elem, member));
    //   });
  }

  /**
   * performing mapping for settlement of expenses
   *
   * @param {data} GroupExpense
   * @param {member} Map
   */
  expenseSettlement(item:any) {
    this.user = this.userService.getUserInDashboard();
    let map = new Map<string, number>()
    for (var value in item) {
      map.set(value,item[value])
    }
    this.groupService.getGroupById(this.groupID).subscribe((data) => {
      data.members.forEach((element) => {
        if(map.has(element.id)){
          let username = element.firstName + " " + element.lastName;
          this.totalValueMap.set(element, map.get(element.id));
        }
      });
    });
  }

  /**
   * Displayong settled Expenses
   *
   * @param {data} GroupExpense
   * @param {member} Map
   */
  displaySettledExpenses(data, member) {
    let grpExpense: GroupExpense = new GroupExpense();
    for (let index = 0; index < member?.length; index++) {
      if (member[index].id === data.createdBy) {
        grpExpense.createdBy = member[index].firstName;
      }
    }
    grpExpense.sourceGroup = data.sourceGroup;
    grpExpense.name = data.name;

    grpExpense.amount = data.amount;
    grpExpense.id = data.id;

    for (let index = 0; index < member?.length; index++) {
      if (member[index].id === data.paidBy) {
        grpExpense.paidBy = member[index].firstName;
      }
    }
    let key;
    let mems: any[][] = [];

    for (key in data.dividePercentage) {
      for (let index = 0; index < member?.length; index++) {
        if (member[index].id === key) {
          mems.push([member[index], data.dividePercentage[key]]);
        }
      }
    }
    this.percVal.push([grpExpense, mems]);
    this.groupExpenseList.push(grpExpense);
  }

  /**
   * Performing mapping for Group expense fields
   *
   * @param {data} GroupExpense
   * @param {member} Map
   */
  listDividePercent(data, member) {
    let grpExpense: GroupExpense = new GroupExpense();
    let updGrpExpense: GroupExpense = new GroupExpense();
    for (let index = 0; index < member?.length; index++) {
      if (member[index].id === data.createdBy) {
        grpExpense.createdBy = member[index].firstName;
      }
    }
    grpExpense.sourceGroup = data.sourceGroup;
    updGrpExpense.sourceGroup = data.sourceGroup;
    grpExpense.name = data.name;
    updGrpExpense.name = data.name;

    grpExpense.amount = data.amount;
    updGrpExpense.amount = data.amount;
    grpExpense.id = data.id;
    updGrpExpense.id = data.id;
    updGrpExpense.paidBy = data.paidBy;
    updGrpExpense.createdBy = data.createdBy;

    for (let index = 0; index < member?.length; index++) {
      if (member[index].id === data.paidBy) {
        grpExpense.paidBy = member[index].firstName;
      }
    }
    let key;
    let mems: any[][] = [];

    for (key in data.dividePercentage) {
      for (let index = 0; index < member?.length; index++) {
        if (member[index].id === key) {
          mems.push([member[index], data.dividePercentage[key]]);
        }
      }
    }
    this.percVal.push([grpExpense, mems]);
    this.groupUpd.push([updGrpExpense, mems]);
    this.groupExpenseList.push(grpExpense);
  }

  /**
   * deleting the group expense
   *
   * @param {groupExpense} GroupExpense
   */
  deleteExpense(groupExpense: GroupExpense) {
    groupExpense.sourceGroup = this.groupExpenseList[0].sourceGroup;
    this.groupExpenseService.delete(groupExpense).subscribe((data) => {
      this.groupExpenseList = this.groupExpenseList.filter(
        (u) => u !== groupExpense
      );
    });
  }

  /**
   * updating the group expense
   *
   * @param {groupExpense} GroupExpense
   */
  updateRowData(groupExpense: GroupExpense) {
    let obj = {};
    let x = 0;
    this.percVal.forEach((item) => {
      if (item[0].id === groupExpense.id) {
        item[1].map((elem) => {
          groupExpense.dividePercentage.set(elem[0].id, elem[1]);
          x = x + elem[1];
          groupExpense.dividePercentage.forEach(function (value, key) {
            obj[key] = value;
          });
        });
      }
    });

    groupExpense.dividePercentage = obj;

    this.groupUpd.map((items) => {
      if (items[0].id === groupExpense.id) {
        groupExpense.paidBy = items[0].paidBy;
        groupExpense.createdBy = items[0].createdBy;
      }
    });

    groupExpense.sourceGroup = this.groupExpenseList[0].sourceGroup;
    if (x === 1) {
      this.groupExpenseService.update(groupExpense).subscribe((data) => {});
      this.router.navigate(["/user/dashboard/rd",this.groupID]);
    } else {
        this.alertService.error('share total should equal to 1');
        setTimeout(() => {this.router.navigate(['/user/dashboard/rd', this.groupID]); }, 2000);
    }
  }

  /**
   * This method connect the service post with a pop up dialog.
   */
  settleExpense(userId: string, name: string,amount:number) {
    this.settle = new Settle();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.data = {
      id: userId,
      dispName: name
    };
    this.dialog.open(SettleComponent, {
      data: { dispName: name, id: userId,groupId: this.groupID, amount: amount * -1},
    });
    this.router.navigate(['/user/dashboard/rd',this.groupID]);
  }
}
