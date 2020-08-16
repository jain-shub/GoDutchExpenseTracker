import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Group } from "app/model/group.model";
import { AlertService } from "../../services/alert.service";
import { GroupService } from "../../services/group.service";

/**
 * Get All Group Component Class. Get all the group details from the database.
 *
 * @author goelsarthak
 */
@Component({
  selector: "app-get-all-group",
  templateUrl: "./get-all-group.component.html",
  styleUrls: ["./get-all-group.component.scss"],
})
export class GetAllGroupComponent implements OnInit {
  groupList: Group[];
  group: Group;

  /**
   * Constructor
   *
   * @param alertService
   * @param GroupService
   */
  constructor(
    private alertService: AlertService,
    private groupService: GroupService,
    private router: Router
  ) {
    this.group = new Group();
  }

  /**
   * Refresh the group upon addition & deletion
   */
  ngOnInit(): void {
    this.groupService.refreshNeeded$.subscribe(() => {
      this.getAllGroups();
    });
    this.getAllGroups();
  }

  /**
   * Retrieves the groups from DB by calling Get all Group API
   */
  getAllGroups() {
    this.groupService.getGroupDetails().subscribe(
      (data) => {
        this.groupList = data;
      },
      (error) => {
        this.alertService.error(error);
      }
    );
  }

  /**
   * To view the particular group details from group list, passing group id query parameter
   */
  viewGroup(group: Group) {
    this.router.navigate(["/user/dashboard/redirect", group.id]);
  }
}
