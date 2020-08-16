import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from "app/services/user.service";
import { UserRegistration } from "app/model/user-registartion.model";

@Component({
  selector: "app-user-pages",
  templateUrl: "./user-pages.component.html",
  styleUrls: ["./user-pages.component.scss"],
})
export class UserPagesComponent implements OnInit {
  userService: UserService;
  user: UserRegistration;
  token: string;
  constructor(
    userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userService = userService;
    this.user = this.userService.getUserInDashboard();
    this.token = this.userService.getToken();
    if (!this.token) {
      this.router.navigate(["/login"]);
    } else {
      if (this.userService.isAccountSettingsClicked()) {
        this.router.navigate(["edit"], {
          relativeTo: this.route,
        });
      } else {
        this.router.navigate(["dashboard/user-expense"], { relativeTo: this.route });
      }
    }
  }

  ngOnInit(): void {}
}
