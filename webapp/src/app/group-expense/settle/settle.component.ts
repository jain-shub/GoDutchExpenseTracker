import { AlertService } from './../../services/alert.service';
import { AppModule } from './../../app.module';
import { GroupExpenseService } from 'app/services/group-expense.service';
import { ExpenseService } from 'app/services/expense.service';
import { Settle } from './../../model/settle.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
/**
 * author @manorath_bajaj
 */
@Component({
  selector: 'app-settle',
  templateUrl: './settle.component.html',
  styleUrls: ['./settle.component.scss']
})
export class SettleComponent implements OnInit {
  settle: Settle;
  dispName: string;
  groupid: string;
  maxAmount: number;
  router: Router;

  constructor(@Inject(MAT_DIALOG_DATA) data, private settleService: GroupExpenseService
  ,           private alertService: AlertService,
              private dialogRef: MatDialogRef<SettleComponent>) {
    this.settle = new Settle();
    this.settle.toUser = data?.id;
    this.dispName = data.dispName;
    this.groupid = data.groupId;
    this.maxAmount = data.amount;
    this.settle.amount = data.amount;
   }

  ngOnInit(): void {
  }

  /**
   * Post a settle request based on the dialog.
   */
  settlePost(): void {
    if(this.maxAmount < this.settle.amount){
      this.alertService.error('amount cannot be greater than maximum amount');
    }
    this.settleService.settle(this.settle, this.groupid).subscribe();
    this.close();
  }

  /**
   * close the dialog component
   */
  close(): void {
    this.dialogRef.close();
  }

}
