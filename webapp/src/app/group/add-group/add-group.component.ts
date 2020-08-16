import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserRegistration } from "app/model/user-registartion.model";
import { UtilityService } from "app/services/form-validation-utility.service";
import { UserService } from "app/services/user.service";
import { Group } from "../../model/group.model";
import { AlertService } from "../../services/alert.service";
import { GroupService } from "../../services/group.service";

/**
 * Add Group Component Class. Add the group details containg user emails.
 *
 * @author goelsarthak
 */
@Component({
  selector: "app-add-group",
  templateUrl: "./add-group.component.html",
  styleUrls: ["./add-group.component.scss"],
})
export class AddGroupComponent implements OnInit {
  form: FormGroup;
  group: Group;
  user: UserRegistration;
  utility: UtilityService = new UtilityService();
  mySet: Set<string> = new Set<string>();
  formSubmitted = false;

  /**
   * Constructor
   *
   * @param UtilityService
   * @param expenseService
   * @param alertService
   * @param GroupService
   */
  constructor(
    utility: UtilityService,
    private fb: FormBuilder,
    private groupService: GroupService,
    private alertService: AlertService,
    private userService: UserService,
    private router: Router
  ) {
    this.utility = utility;
    this.group = new Group();
    this.form = fb.group({
      name: [, Validators.required],
      memberEmail: this.fb.array([this.fb.group({ email: "" })]),
    });
  }
  ngOnInit(): void {}

  /**
   * Retrieves the memberEmail array to fetch user email
   */
  get memberEmail() {
    return this.form.get("memberEmail") as FormArray;
  }

  /**
   * Adds the memberEmail array to support dynamic user addition in Group/
   */
  addMember() {
    this.memberEmail.push(this.fb.group({ email: "" }));
  }

  /**
   * Add the group details by claiing the Post Group API in group service class
   */
  onSubmit() {
    let groupName = this.group.name;
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
          if (this.user.email.localeCompare(str[key]) == 0) {
            this.alertService.error(
              "Can not add the email id of one who is creating the group"
            );
            flag = false;
          } else {
            if (this.mySet.has(str[key])) {
              this.alertService.error("Duplicate Email Address Not Allowed");
              flag = false;
            } else {
              this.mySet.add(str[key]);
              memEmail.push(str[key]);
            }
          }
        } else {
          this.alertService.error("Please enter the valid email");
        }
      });
    }

    if (flag) {
      if (groupName && memEmail.length > 0) {
        this.groupService.addGroup(this.group.name, memEmail).subscribe(
          (data) => {
            this.alertService.success("Group Creation successful", true);
            this.close();
          },
          (error) => {
            this.alertService.error(error);
          }
        );
      }
      this.formSubmitted = true;
    }
  }

  /**
   * Rerouting the control back to user dashboard
   */
  close() {
    this.router.navigate(["/user/dashboard/user-expense"]);
  }

  removeMemberAddField(index: number) {
    this.memberEmail.removeAt(index);
  }
}
