import { Settle } from './../model/settle.model';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GroupExpense } from "app/model/group-expense.model";
import { Observable, Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { AlertService } from "app/services/alert.service";

@Injectable({
  providedIn: "root",
})
/**
 * Service class for the Group Expense Component.
 *
 * @author jain-shub
 */
export class GroupExpenseService {
  /**
   * Constructor.
   */
  constructor(private http: HttpClient, private alertService: AlertService) {}
  private _refresh$ = new Subject<void>();

  get refresh$() {
    return this._refresh$;
  }

  /**
   * service to call api for adding group expense
   *
   * @param {name} string
   * @param {sourceGroup} string
   * @param {amount} number
   * @param {dividePercentage} any
   * @param {paidBy} string
   * @param {createdBy} string
   * @return {GroupExpense}
   */
  addGroupExpense(
    name: string,
    sourceGroup: string,
    amount: number,
    dividePercentage: any,
    paidBy: string,
    createdBy: string
  ): Observable<GroupExpense> {
    const groupExp: GroupExpense = {
      id: "",
      name: name,
      sourceGroup: sourceGroup,
      amount: amount,
      dividePercentage: dividePercentage,
      paidBy: paidBy,
      createdBy: createdBy,
    };
    if (dividePercentage === null) {
      this.alertService.error("Total share split should be 100");
    } else {
      return this.http.post<GroupExpense>(
        "http://localhost:3000/v1/" + sourceGroup + "/expenses",
        groupExp
      );
    }
  }

  /**
   * service to call api for getting group expense
   *
   * @param {groupID} string
   * @return {GroupExpense}
   */
  public getExpense(groupID: string) {
    const token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders().set("Authorization", `Token ` + token),
    };
    return this.http.get<GroupExpense[]>(
      "http://localhost:3000/v1/" + groupID + "/expenses/"
    );
  }

  /**
   * service to call api for deleting a group expense
   *
   * @param {expense} GroupExpense
   * @return {GroupExpense}
   */
  public delete(expense: GroupExpense) {
    let id = expense.id;
    const token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders().set("Authorization", `Token ` + token),
    };
    return this.http.delete(
      "http://localhost:3000/v1/" + expense.sourceGroup + "/expense" + "/" + id,
      header
    );
  }

  /**
   * service to call api for settling an expense (Post)
   *
   * @param {groupid} string
   * @param {groupExpense} GroupExpense
   * @return {GroupExpense}
   */
  public settle(settle: Settle,groupid:string) {
    const token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders().set("Authorization", `Token ` + token),
    };
    return this.http.post<Settle>(
      "http://localhost:3000/v1/" +
          groupid +
        "/expenses/settle", settle);
  }

  /**
   * service to call api for getting single user
   *
   * @param {groupID} string
   * @return {GroupExpense}
   */
  public getSettledExpenses(groupID: string) {
    const token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders().set("Authorization", `Token ` + token),
    };
    return this.http.get<GroupExpense[]>(
      "http://localhost:3000/v1/" + groupID + "/expenses/settle"
    );
  }


  /**
   * service to call api for updating group expense
   *
   * @param {expense} GroupExpense
   * @return {GroupExpense}
   */
  public update(expense: GroupExpense) {
    let id = expense.id;
    const token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders().set("Authorization", `Token ` + token),
    };
    return this.http
      .put(
        "http://localhost:3000/v1/" +
          expense.sourceGroup +
          "/expense" +
          "/" +
          id,
        expense,
        header
      )
      .pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  /**
   * service to call api for getting total amount of group
   *
   * @param {groupID} string
   */
  getTotalOfGroup(groupID: string) {
    const token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders().set("Authorization", `Token ` + token),
    };
    return this.http.get<any>(
      "http://localhost:3000/v1/" + groupID + "/expenses/total",
      header
    );
  }
}
