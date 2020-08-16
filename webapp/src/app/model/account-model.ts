import { MatTableDataSource } from "@angular/material/table";
import { Transaction } from "./transactions-model";

/**
 * Model Account Class
 *
 * @author rohan_bharti
 */
export class Account {
  _id: string;
  id: string;
  accessToken: string;
  itemId: string;
  institutionId: string;
  institutionName: string;
  accountName: string;
  accountType: string;
  accountSubtype: string;
  institution: { name: string; institution_id: string };
  publicToken: string;
  transactions: MatTableDataSource<Transaction>;

  constructor() {}
}
