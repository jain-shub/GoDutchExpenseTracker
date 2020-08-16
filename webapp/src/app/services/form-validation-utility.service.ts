import { Injectable } from '@angular/core';
import { ErrorStateMatcher } from "@angular/material/core";
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from "@angular/forms";

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  data: any;

  constructor() { }

  emailFormControl = new FormControl("", [
    Validators.required,
    Validators.email,
    Validators.pattern("^[a-z0-9\.\_\%\+\-]+@[a-z0-9\.\-]+\.[a-z]{2,4}$")
  ]);



  userNameFormControl = new FormControl("", [
    Validators.required,
    Validators.pattern("[a-zA-Z]+[0-9]*"),
    Validators.minLength(6),
    Validators.maxLength(16)
  ]);

  firstNameFormControl = new FormControl("", [
    Validators.required,
    Validators.pattern("[a-zA-Z]+"),
    Validators.maxLength(16)
  ]);

  lastNameFormControl = new FormControl("", [
    Validators.pattern("[a-zA-Z]+"),
    Validators.maxLength(16)
  ]);

  passwordFormControl = new FormControl("", [
    Validators.required,
    Validators.pattern("[a-zA-Z]+[0-9]*[@#!$%^&*]+[a-zA-Z0-9]+"),
    Validators.minLength(6),
    Validators.maxLength(16)
  ]);

  expenseCatergoryFormControl = new FormControl("", [
    Validators.required,
    Validators.pattern("[a-zA-Z]+")
  ]);


  amountFormControl = new FormControl("", [
    Validators.required,
    // Validators.pattern("[0-9]+"),
    Validators.pattern("[0-9]+(\.[0-9][0-9]?)?"),
    Validators.maxLength(10),
    Validators.min(1)
  ]);

  expenseTypeFormControl = new FormControl("", [
    Validators.required,
    Validators.pattern("CUSTOM|SPLIT|FULL")
  ]);

  toSplitPercentFormControl = new FormControl("", [
    Validators.required,
    Validators.pattern("^100(\.[0]{1,2})?|([0-9]|[1-9][0-9])(\.[0-9]{1,2})?$"),
    Validators.maxLength(3)
  ]);

  fromSplitPercentFormControl = new FormControl("", [
    Validators.required,
    Validators.pattern("^100(\.[0]{1,2})?|([0-9]|[1-9][0-9])(\.[0-9]{1,2})?$"),
    Validators.maxLength(6)
  ]);

  otpFormControl = new FormControl("",[
    Validators.required,
    Validators.pattern("[0-9]+"),
    Validators.minLength(6),
    Validators.maxLength(6)
  ]);

  groupIdFormControl = new FormControl("", [
    Validators.required,
    Validators.pattern("[a-zA-Z0-9]+"),
    Validators.minLength(6),
    // Validators.maxLength(16)
  ]);

  paidByFormControl = new FormControl("", [
    Validators.required,
    Validators.pattern("[a-zA-Z0-9]+"),
    Validators.minLength(6),
    // Validators.maxLength(16)
  ]);

  createdByFormControl = new FormControl("", [
    Validators.required,
    Validators.pattern("[a-zA-Z0-9]+"),
    Validators.minLength(6),
    // Validators.maxLength(16)
  ]);

  ratioFormControl = new FormControl("", [
    Validators.required,
    Validators.pattern("[0-9]{0,2}"),
  ]);

  emailMatcher = new MyErrorStateMatcher();
  userNameMatcher = new MyErrorStateMatcher();
  firstNameMatcher = new MyErrorStateMatcher();
  lastNameMatcher = new MyErrorStateMatcher();
  passwordMatcher = new MyErrorStateMatcher();
  expenseCatergoryMatcher = new MyErrorStateMatcher();
  amountMatcher = new MyErrorStateMatcher();
  expenseTypeMatcher = new MyErrorStateMatcher();
  toSplitPercentMatcher = new MyErrorStateMatcher();
  fromSplitPercentMatcher = new MyErrorStateMatcher();
  otpMatcher = new MyErrorStateMatcher();
  groupIdMatcher = new MyErrorStateMatcher();
  paidByMatcher = new MyErrorStateMatcher();
  createdByMatcher = new MyErrorStateMatcher();
  userNameTip =
    "Please enter user name in format Name followed by number without special characters(Min length: 6, Max Length:16)";
  firstNameTip = "Please enter first name without any number or special characters(Max Length:16)";
  lastNameTip = "Please enter first name without any number or special characters(Max Length:16)";
  emailTip = "Please enter email id in format username@domain.com";
  passwordTip =
    "Please enter password in format Name followed by number without special characters(Min length: 6, Max Length:16)";
  otpTip = "Please enter the otp in numeric format";
}
