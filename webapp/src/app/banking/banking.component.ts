import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
import { AccountService } from "../services/account.service";
import { Observable } from "rxjs";
import { Account } from "../model/account-model";

/**
 * Banking Component to fetch the accounts for the user and supply them to the Account Component.
 *
 * @author rohan_bharti
 */
@Component({
  selector: "app-banking",
  templateUrl: "./banking.component.html",
  styleUrls: ["./banking.component.scss"],
})
export class BankingComponent implements OnInit {
  @Input() accountsParent: Array<Account> = [];
  @Input() accountsExist: boolean = false;

  /**
   * Constructor
   *
   * @param router
   * @param accountService
   */
  constructor(private router: Router, private accountService: AccountService) {
    let fetchAccounts$: Observable<Array<
      Account
    >> = accountService.getAccounts();
    fetchAccounts$.subscribe((accounts) => {
      if (accounts && accounts.length > 0) {
        this.accountsParent = accounts;
        this.accountsExist = true;
      }
    });
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
    this.accountsExist = true;
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

  ngOnInit(): void {}
}
