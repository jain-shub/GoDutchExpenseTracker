import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { UserRegistration } from "app/model/user-registartion.model";
import { UserService } from "app/services/user.service";
import { UpdateUserComponent } from "../update-user/update-user.component";

/**
 * Dashoboard Component Class. Adds the dynamic toolbar & side nav bar for user Dashboard.
 *
 * @author goelsarthak
 */
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  user: UserRegistration;
  token: string;
  userService: UserService;

  /**
   * Constructor
   *
   * @param alertService
   * @param GroupService
   */
  constructor(
    private router: Router,
    userService: UserService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.userService = userService;
  }

  /**
   * Retreives the logged in user details & jwt token of the user & routes to login if token not found
   */
  ngOnInit(): void {
    this.user = this.userService.getUserInDashboard();
    this.token = this.userService.getToken();
    if (!this.token) {
      this.router.navigate(["/login"]);
    }
  }

  isMenuOpen = true;
  contentMargin = 240;

  /**
   * Method to support the side nav bar toggle functionality
   */
  onToolbarMenuToggle() {
    this.isMenuOpen = !this.isMenuOpen;

    if (!this.isMenuOpen) {
      this.contentMargin = 0;
    } else {
      this.contentMargin = 240;
    }
  }

  /**
   * Logouts the user by calling the logout method from user services
   */
  logout() {
    this.userService.logout();
    this.router.navigate(["/login"]);
  }

  /**
   * Method that lets you to update the user details.
   */
  updateUserAccount() {
    let isAccountClicked: boolean = true;
    this.userService.setUserInDashboard(
      this.user,
      this.token,
      isAccountClicked
    );

    // Using dialog box for user update
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(UpdateUserComponent, dialogConfig);
  }

  /**
   * Routes the control to banking module
   */
  onBanking() {
    this.router.navigateByUrl("user/banking");
  }
}
