import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { UserRegistration } from "app/model/user-registartion.model";
import { UtilityService } from "app/services/form-validation-utility.service";
import { UserService } from "app/services/user.service";
import { Group } from "../../model/group.model";
import { AlertService } from "../../services/alert.service";
import { GroupService } from "../../services/group.service";

/**
 * View Group Component Class. View the group details with functionality link to update group, delete group, add group expense˝
 *
 * @author goelsarthak
 */
@Component({
  selector: "app-view-group",
  templateUrl: "./view-group.component.html",
  styleUrls: ["./view-group.component.scss"],
})
export class ViewGroupComponent implements OnInit {
  form: FormGroup;
  name: string;
  groupType: string;
  createdByName: string;
  memEmail: Array<string>;
  groupID: any;
  group: Group;
  user: UserRegistration;
  formDisabled: boolean = true;
  mySet: Set<string> = new Set<string>();

  /**
   * Constructor
   *
   * @param alertService
   * @param groupService
   * @param utilityService
   */
  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private alertService: AlertService,
    private utilityService: UtilityService,
    private activatedroute: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {
    this.memEmail = [];
  }

  /**
   * Retreives the group id that is passed to this component as query parameter & initialize the user form
   */
  ngOnInit(): void {
    this.activatedroute.params.subscribe((params) => {
      this.groupID = params["id"];
    });

    //Retreives the Group Info by calling Get Group By Id method of service class
    this.groupService.getGroupById(this.groupID).subscribe((data) => {
      this.group = data;
      this.computeMemberEmail();
    });

    this.initForm();
    //this.form.disable();
  }

  /**
   * Initializes the user form so as to display the group details
   */
  initForm() {
    this.form = this.fb.group({
      name: [this.name, Validators.required],
      groupType: [this.groupType, Validators.required],
      createdByName: [this.createdByName, Validators.required],
      memEmail: [this.memEmail, Validators.required],
      memberEmail: this.fb.array([this.fb.group({ email: "" })]),
    });
  }

  get memberEmail() {
    return this.form.get("memberEmail") as FormArray;
  }

  /**
   * Method to add new members to existing group
   */
  addMember() {
    this.memberEmail.push(this.fb.group({ email: "abc@xyz.com" }));
  }

  /**
   * Retreiving the Member emails from group object
   */
  computeMemberEmail() {
    this.name = this.group?.name;
    this.groupType = this.group?.groupType;
    let createdName = this.group?.createdBy;
    this.createdByName =
      Object.values(createdName)[0] + " " + Object.values(createdName)[1];
    for (let i = 0; i < this.group?.members?.length; i++) {
      this.memberEmail.push(
        this.fb.group({ email: this.group?.members[i]?.email })
      );
    }
  }

  /**
   * Updating the existing group details & routing the control back to user dashboard
   */
  save() {
    this.router.navigate(["/user/dashboard/add-group-expense", this.groupID]);
  }

  /**
   * Routing the control to add group expense page by passing Group Id as query parameter
   */
  viewGroupExpenses() {
    this.router.navigate(["/user/dashboard/view-group-expense", this.groupID]);
  }

  /**
   * Close the existing group details & routing the control back to user dashboard
   */
  close() {
    this.router.navigate(["/user/dashboard/user-expense"]);
  }

  /**
   * Delete the existing group details & routing the control back to user dashboard
   */
  delete() {
    let groupId = this.groupID;
    this.groupService.deleteGroup(groupId).subscribe(
      (data) => {
        this.alertService.success("delete successful", true);
        this.close();
      },
      (error) => {
        this.alertService.error(error);
      }
    );
  }

  /**
   * Method to validate the updated fields and upon validation calling PUT API of group service.
   */
  onDisable(init: boolean) {
    let groupName = this.name;
    if (!groupName) {
      this.alertService.error("Group Name is mandatory");
    }
    let memEmail: Array<string> = [];
    let regexp = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$");
    this.user = this.userService.getUserInDashboard();
    let flag = true;
    for (var i = 0; i < this.memberEmail.value.length; i++) {
      var str = this.memberEmail.value[i];
      Object.keys(str).forEach((key) => {
        if (str[key] && regexp.test(str[key])) {
          if (this.mySet.has(str[key])) {
            this.alertService.error("Duplicate Email Address Not Allowed");
            flag = false;
          } else {
            this.mySet.add(str[key]);
            memEmail.push(str[key]);
          }
        } else {
          this.alertService.error("Please enter the valid email");
        }
      });
    }

    if (flag) {
      if (groupName && memEmail.length > 0) {
        this.groupService
          .updateGroup(this.group?.id, groupName, memEmail)
          .subscribe(
            (data) => {
              this.alertService.success("Group Creation successful", true);
              this.close();
            },
            (error) => {
              this.alertService.error(
                "Can not Delete the Primary Account Email ID"
              );
            }
          );
      }
    }
  }
}
