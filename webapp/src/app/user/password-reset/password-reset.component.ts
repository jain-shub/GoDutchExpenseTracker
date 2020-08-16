import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UtilityService } from "app/services/form-validation-utility.service";
import { AlertService } from "../../services/alert.service";
import { UserService } from "../../services/user.service";

/**
 * Password Reset Component Class. Let the user to recover the lost password info.
 *
 * @author goelsarthak
 */
@Component({
  selector: "app-password-reset",
  templateUrl: "./password-reset.component.html",
  styleUrls: ["./password-reset.component.scss"],
})
export class PasswordResetComponent implements OnInit {
  show: boolean = true;
  utility: UtilityService;
  private _shown = false;

  formSubmitted = false;
  myForm: FormGroup;
  myNewForm: FormGroup;
  email: FormControl;
  otp: FormControl;
  password: FormControl;

  /**
   * Constructor
   *
   * @param alertService
   * @param utilityService
   * @param userService
   */
  constructor(
    utility: UtilityService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    this.utility = utility;
  }

  /**
   * Initializes the form and adds the custom form validators
   */
  ngOnInit(): void {
    this.email = new FormControl("", [
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
    ]);
    this.otp = new FormControl("", [
      Validators.required,
      Validators.pattern("[0-9]+"),
      Validators.minLength(6),
      Validators.maxLength(6),
    ]);
    this.password = new FormControl("", [
      Validators.required,
      Validators.pattern("[a-zA-Z]+[0-9]*[@#!$%^&*]+[a-zA-Z0-9]+"),
    ]);
    this.myForm = new FormGroup({
      email: this.email,
    });
    this.myNewForm = new FormGroup({
      otp: this.otp,
      password: this.password,
    });
  }

  /**
   * Method that validates the user email & send OTP to his registerd account
   * @param userEmail
   */
  recover(userEmail: string) {
    if (userEmail) {
      this.show = !this.show;
      this.userService.recoverPassword(userEmail).subscribe(
        (res) => {},
        (error) => {
          this.alertService.error("User Email Not Registered");
        }
      );
      this.formSubmitted = true;
    }
  }

  /**
   * Method that validates the user email & send OTP to his registerd account
   * @param myOTP
   * @param myPassword
   * @param myConfirmPassword
   */
  reset(myOTP: string, myPassword: string, myConfirmPassword: string) {
    var index = myPassword.localeCompare(myConfirmPassword);
    if (index === 0) {
      this.userService.resetPassword(myOTP, myPassword).subscribe(
        (res) => {
          alert("Password has been reset successfully");
          window.location.href = "/login";
        },
        (error) => {
          // error display on incorrect otp
          this.alertService.error("Incorrect OTP");
        }
      );
      this.formSubmitted = true;
    } else {
      this.alertService.error("Passwords do not match!");
    }
  }
}
