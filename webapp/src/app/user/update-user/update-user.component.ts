import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { UserService } from "../../services/user.service";
import { UserRegistration } from "../../model/user-registartion.model";
import { Router } from "@angular/router";
import { MatDialogRef } from "@angular/material/dialog";
import { AlertService } from "app/services/alert.service";

/**
 * Update User Component
 *
 * @author jain-shub
 */
@Component({
  selector: "app-update-user",
  templateUrl: "./update-user.component.html",
  styleUrls: ["./update-user.component.scss"],
})
export class UpdateUserComponent implements OnInit {
  private userEmail: string;
  user: UserRegistration;
  userService: UserService;
  private token: string;

  /**
   * Constructor
   *
   * @param alertService
   * @param dialogRef
   * @param userService
   * @param router
   */
  constructor(
    userService: UserService,
    private router: Router,
    public dialogRef: MatDialogRef<UpdateUserComponent>,
    private alertService: AlertService
  ) {
    this.userService = userService;
  }

  /**
   * Setting User and token on login
   */
  ngOnInit(): void {
    this.user = this.userService.getUserInDashboard();
    this.token = this.userService.getToken();
    if (!this.token) {
      this.router.navigate(["/login"]);
    }
  }

  /**
   * Calling Update in service to perform user details update
   */
  onSaveUpdate() {
    this.userService.updateUser(this.user, this.token).subscribe((response) => {
      this.user = response;
      this.alertService.success("Registration successful", true);
    }),
      (error) => {
        this.alertService.error(error);
      };
    this.dialogRef.close();
  }

  /**
   * Closes dialog box
   */
  close() {
    this.dialogRef.close();
  }
}
