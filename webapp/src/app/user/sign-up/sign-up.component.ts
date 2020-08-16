import { Component, OnInit } from "@angular/core";
import { UtilityService } from "app/services/form-validation-utility.service";
import { UserService } from "app/services/user.service";
import { UserRegistration } from "app/model/user-registartion.model";
import { NgForm } from "@angular/forms";
import { Routes, Router } from "@angular/router";
import { AlertService } from "../../services/alert.service";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"],
  providers: [UserService],
})
/**
 * Sign up component
 *
 * @author jain-shub
 */
export class SignUpComponent implements OnInit {
  // Declaring variable to be used at sign up
  userList: UserRegistration[] = [];
  user: UserRegistration;
  userService: UserService;
  utility: UtilityService = new UtilityService();
  private _shown = false;


  /**
   * Constructor
   *
   * @param alertService
   * @param utilityService
   * @param userService
   */
  constructor(
    utility: UtilityService,
    userService: UserService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.utility = utility;
    this.userService = userService;
    this.user = new UserRegistration();
  }

  ngOnInit(): void {}


  /**
   * function created to add a new user by providing parameters of user and subscribing the new user created
   */
  addUser() {
    this.userService
      .addUser(
        this.user.firstName,
        this.user.lastName,
        this.user.email,
        this.user.password
      )
      .subscribe(
        (data) => {
          this.userList.push(data);
          this.alertService.success("Registration successful", true);
          this.router.navigate(["/login"]);
        },
        (error) => {
          if(error.includes(400)){
            this.alertService.error("Invalid Sign Up Request, please check all the fields");
          }else{
            this.alertService.error(error);
          }

          if(error.includes(500)){
            this.alertService.error("This Email ID is already registered.");
          }
        }
      );
  }

  /**
   * functionality to view or unview password field to the user
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
