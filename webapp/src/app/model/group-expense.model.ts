import { Group } from './group.model';

/**
 * Model Group Expense Class
 *
 * @author jain-shub
 */
export class GroupExpense {
  id: string = "";
  name: string;
  sourceGroup: string; // The group with which expense is associated to
  // Group
  amount: number;
  dividePercentage: any;
  paidBy: string = "";
  createdBy: string = "";

  constructor() {
    this.dividePercentage = new Map();
  }
}
