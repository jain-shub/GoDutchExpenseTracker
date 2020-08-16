import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError, Subject, EMPTY } from "rxjs";
import { catchError, retry, shareReplay } from "rxjs/operators";
import { Account } from "../model/account-model";
import { environment } from "./../../environments/environment";
import { Transaction } from "../model/transactions-model";

/**
 * Service class for the Account model. Works with the Banking Component.
 *
 * @author rohan_bharti
 */
@Injectable({
  providedIn: "root",
})
export class AccountService {
  accountResource: string;
  accountResourceURL: string;
  newAccountSubject: Subject<Account>;
  deleteAccountSubject: Subject<Account>;

  /**
   * Constructor.
   */
  constructor(private http: HttpClient) {
    this.accountResource = "v1/accounts";
    this.accountResourceURL = `${environment.serverBaseURL}/${this.accountResource}`;
    this.newAccountSubject = new Subject<Account>();
    this.deleteAccountSubject = new Subject<Account>();
  }

  /**
   * Creates new Account once the user has authenticated with the Plaid Service.
   *
   * @param {Account} account: account {new Account object}
   * @return {Observable<Account>} {Observable for saved account object}
   */
  createAccount(
    publicToken: string,
    institution: { name: string; institution_id: string }
  ): Observable<Account> {
    const token = localStorage.getItem("token");
    let newAccount = new Account();
    newAccount.publicToken = publicToken;
    newAccount.institution = institution;
    let header = {
      headers: new HttpHeaders().set("Authorization", `Token ` + token),
    };
    return this.http.post<Account>(this.accountResourceURL, newAccount, header);
  }

  /**
   * Returns an array of all the accounts linked by the user.
   */
  getAccounts(): Observable<Array<Account>> {
    const token = localStorage.getItem("token");
    let header = {
      headers: new HttpHeaders().set("Authorization", `Token ` + token),
    };
    return this.http.get<Array<Account>>(this.accountResourceURL, header);
  }

  /**
   * Takes in the account object and deletes it via making a call to the server.
   *
   * @param account
   */
  deleteAccount(account: Account): Observable<Account> {
    const token = localStorage.getItem("token");
    let accountId: string = account._id ? account._id : account.id;
    let deleteAccountUrl: string = this.accountResourceURL + "/" + accountId;
    let header = {
      headers: new HttpHeaders().set("Authorization", `Token ` + token),
    };
    return this.http.delete<Account>(deleteAccountUrl, header);
  }

  /**
   * Returns an array of Transactions for the AccountId supplied. Retries attempts since the Plad API takes some time
   * to process the transactions.
   *
   * @param accountId
   * @param daysNum
   */
  fetchAccountTransactions(
    accountId: string,
    daysNum: string
  ): Observable<Array<Transaction>> {
    const token = localStorage.getItem("token");
    let header = {
      headers: new HttpHeaders().set("Authorization", `Token ` + token),
    };
    let fetchTransactionsUrl =
      this.accountResourceURL + "/" + accountId + "/transactions/" + daysNum;
    return this.http.get<Array<Transaction>>(fetchTransactionsUrl, header).pipe(
      retry(3),
      catchError(() => {
        return EMPTY;
      })
    );
  }
}
