import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { Expense } from "../model/expense.model";

/**
 * Service class for the Individaul User Expence Component. Works with every component.
 *
 * @author goelsarthak
 */
@Injectable({
  providedIn: "root",
})
export class ExpenseService {
  /**
   * Constructor.
   */
  constructor(private http: HttpClient) {}

  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  /**
   * Creates new Expense once the user has authenticated.
   *
   * @param {toEmail} string
   * @param {expenseName} string
   * @param {amount} string
   * @param {type} string
   * @param {fromUserSplitPercentageValue} string
   * @param {toUserSplitPercentageValue} string
   * @return {Expense}
   */
  addExpense(
    toEmail: string,
    expenseName: string,
    amount: string,
    type: string,
    fromUserSplitPercentageValue: string,
    toUserSplitPercentageValue: string
  ) {
    const expense: Expense = {
      id: "",
      toEmail: toEmail,
      fromUserName: "",
      toUserName: "",
      name: expenseName,
      amount: amount,
      type: type,
      fromUserSplitPercentageValue: fromUserSplitPercentageValue,
      toUserSplitPercentageValue: toUserSplitPercentageValue,
    };
    const token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders().set("Authorization", `Token ` + token),
    };
    return this.http
      .post<Expense>("http://localhost:3000/v1/expense", expense, header)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
        })
      );
  }

  /**
   * Calls the Expense Get API that returns the list of expense objects
   *
   * @return {Expense[]} {Expense object Array}
   */
  public getExpense() {
    const token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders().set("Authorization", `Token ` + token),
    };
    return this.http.get<Expense[]>("http://localhost:3000/v1/expense");
  }

  /**
   * Deletes the expense based on the expense id
   *
   * @param {id} : string
   *
   */
  public delete(id: string) {
    const token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders().set("Authorization", `Token ` + token),
    };
    return this.http
      .delete("http://localhost:3000/v1/expense" + "/" + id, header)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
        })
      );
  }

  /**
   * Updates the individual user expense once the user has authenticated
   *
   * @param {Expense} expense
   * @return {Expense}
   */
  public update(expense: Expense) {
    let id = expense.id;
    const token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders().set("Authorization", `Token ` + token),
    };
    return this.http
      .put("http://localhost:3000/v1/expense" + "/" + id, expense, header)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
        })
      );
  }
}
