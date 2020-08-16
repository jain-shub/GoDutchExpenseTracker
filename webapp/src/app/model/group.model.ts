/**
 * Model Account Class
 *
 * @author goelsarthak
 */
export class Group {
  id: string ="";
  name: string;
  groupType: string = "DEFAULT";
  createdBy: string = "";
  memberEmail: Array<string>;
  members: any[];

  constructor() {}
}
