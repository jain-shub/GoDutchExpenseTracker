import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserRegistration } from "app/model/user-registartion.model";
import { UtilityService } from "app/services/form-validation-utility.service";
import { UserService } from "app/services/user.service";
import { AlertService } from "../../services/alert.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
/**
 * Component class for the Group Expense Component.
 *
 * @author jain-shub
 */
export class LoginComponent implements OnInit {
  http: HttpClient;
  utility: UtilityService;
  private userServiceObj: UserService;
  user: UserRegistration;
  private token: string;
  private _shown = false;

  /**
   * Constructor.
   */
  constructor(
    utilityObj: UtilityService,
    private router: Router,
    private alertService: AlertService,
    private userService: UserService
  ) {
    //Logout if already Logged in
    this.userService.logout();
    this.utility = utilityObj;
    this.userServiceObj = userService;
    this.user = new UserRegistration();
  }

  ngOnInit(): void {}

  /**
   * functionality to authentication and login
   *
   * @return {Authentication token and User object}
   */
  login() {
    this.userService.login(this.user.email, this.user.password).subscribe(
      (response: Response) => {
        // login successful if there's a jwt token in the response
        let usr: any;
        usr = response;
        if (usr.jwtToken) {
          // store user details and jwt token in local storage to keep usr logged in between page refreshes
          localStorage.setItem("currentUser", JSON.stringify(usr));
          localStorage.setItem("token", usr.jwtToken);
          this.user = usr as UserRegistration;
          this.token = usr.jwtToken;
        }
        this.userServiceObj.setUserInDashboard(this.user, this.token, false);
        this.router.navigate(["user"]);
      },
      (error) => {
        this.alertService.error("Incorrect Username & Password");
      }
    );
  }

  /**
   * functionality to view and unview the password field
   *
   * @return {Authentication token and User object}
   */
  viewPassword() {
    var x = document.getElementById("pwdField");
    this._shown = !this._shown;
    if (this._shown) {
      x.setAttribute("type", "text");
    } else {
      x.setAttribute("type", "password");
    }
  }
}
