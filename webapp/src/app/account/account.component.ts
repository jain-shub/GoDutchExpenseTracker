import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChildren } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { Transaction } from "app/model/transactions-model";
import { UserService } from "app/services/user.service";
import { Observable } from "rxjs";
import { Account } from "../model/account-model";
import { AccountService } from "../services/account.service";

/**
 * Account Component Class. Fetches all the previously created accounts and keeps in sync with the newly linked Accounts.
 *
 * @author rohan_bharti
 */
@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"],
})
export class AccountComponent implements OnInit, AfterViewInit {
  @Input() accounts: Array<Account> = [];
  dataSources: Array<MatTableDataSource<Transaction>> = [];
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  displayedColumns: string[] = [
    "account",
    "date",
    "name",
    "amount",
    "category",
  ];

  /**
   * Constructor
   *
   * @param accountService
   */
  constructor(
    private router: Router,
    private accountService: AccountService,
    private userService: UserService
  ) {}

  /**
   * Keeps a track of the newly linked accounts via the RxJs Subject and fetches the transactions for them
   */
  ngOnInit(): void {
    this.accountService.newAccountSubject.subscribe((account) => {
      this.accounts.push(account);
      let transactions$ = this.accountService.fetchAccountTransactions(
        account.id,
        "30"
      );
      transactions$.subscribe((transactions) => {
        let dataSource = new MatTableDataSource(transactions);
        dataSource.paginator = this.paginator.toArray()[
          this.accounts.indexOf(account)
        ];
        account.transactions = dataSource;
        account.transactions.sort = this.sort.toArray()[
          this.accounts.indexOf(account)
        ];
        this.dataSources.push(account.transactions);
      });
    });
    this.accountService.deleteAccountSubject.subscribe((account) => {
      this.accounts.forEach((item, index) => {
        if (item === account) this.accounts.splice(index, 1);
      });
    });
  }

  /**
   * AfterInit Hook responseible for fetching the transactions for the accounts persisting in the db
   */
  ngAfterViewInit() {
    for (let account of this.accounts) {
      let transactions$ = this.accountService.fetchAccountTransactions(
        account._id,
        "30"
      );
      transactions$.subscribe((transactions) => {
        let dataSource = new MatTableDataSource(transactions);
        dataSource.paginator = this.paginator.toArray()[
          this.accounts.indexOf(account)
        ];
        account.transactions = dataSource;
        account.transactions.sort = this.sort.toArray()[
          this.accounts.indexOf(account)
        ];
        this.dataSources.push(account.transactions);
      });
    }
  }

  /**
   * Plaid Success Function. Publishes the new Account on its respective subject.
   */
  onPlaidSuccess(event) {
    let onSuccessData = event;
    let publicToken = onSuccessData.token;
    let institution = onSuccessData.metadata.institution;
    let newAccountCreated$: Observable<Account> = this.accountService.createAccount(
      publicToken,
      institution
    );
    newAccountCreated$.subscribe((account) => {
      this.accountService.newAccountSubject.next(account);
    });
  }

  /**
   * Plaid Exit Function
   */
  onPlaidExit(event) {}

  /**
   * Plaid Event Function
   */
  onPlaidEvent(event) {}

  /**
   * Plaid Load Function
   */
  onPlaidLoad(event) {}

  /**
   * Plaid Click Function
   */
  onPlaidClick(event) {}

  /**
   * Exit Function
   */
  exit() {
    this.router.navigateByUrl("/user/dashboard/user-expense");
  }

  /**
   * Remove Account and update the accounts list by publishing it to the subject.
   */
  removeAccount(account: Account) {
    let deleteAccount$: Observable<Account> = this.accountService.deleteAccount(
      account
    );
    deleteAccount$.subscribe(() => {
      this.accountService.deleteAccountSubject.next(account);
    });
  }

  /**
   * Logout Function.
   */
  logout() {
    this.userService.logout();
    this.router.navigate(["/login"]);
  }

  /**
   * Apply Filter Function.
   */
  applyFilter(event: Event, account: Account) {
    const filterValue = (event.target as HTMLInputElement).value;
    account.transactions.filter = filterValue.trim().toLowerCase();
  }
}
