import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BankingComponent } from "app/banking/banking.component";
import { AddGroupExpenseComponent } from "app/group-expense/add-group-expense/add-group-expense.component";
import { GetGroupExpenseComponent } from "app/group-expense/get-group-expense/get-group-expense.component";
import { PageNotFoundComponent } from "app/page-not-found/page-not-found.component";
import { UserPagesComponent } from "app/user/user-pages/user-pages.component";
import { AccountComponent } from "../account/account.component";
import { AddExpenseComponent } from "../expense/add-expense/add-expense.component";
import { AddGroupComponent } from "../group/add-group/add-group.component";
import { ViewGroupComponent } from "../group/view-group/view-group.component";
import { HomeComponent } from "../home-component/home-component.component";
import { DashboardComponent } from "../user/dashboard/dashboard.component";
import { LoginComponent } from "../user/login/login.component";
import { PasswordResetComponent } from "../user/password-reset/password-reset.component";
import { SignUpComponent } from "../user/sign-up/sign-up.component";
import { UpdateUserComponent } from "../user/update-user/update-user.component";
import { GetExpenseComponent } from "./../expense/get-expense/get-expense.component";
import { RedirectComponentComponent } from "./../expense/redirect-component/redirect-component.component";
import { RdComponent } from "./../group-expense/rd/rd.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    pathMatch: "full",
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "signup",
    component: SignUpComponent,
  },
  {
    path: "password_reset",
    component: PasswordResetComponent,
  },
  {
    path: "user",
    component: UserPagesComponent,
    children: [
      {
        path: "dashboard",
        component: DashboardComponent,
        children: [
          {
            path: "add-user-expense",
            component: AddExpenseComponent,
          },
          {
            path: "user-expense",
            component: GetExpenseComponent,
          },
          {
            path: "add-group",
            component: AddGroupComponent,
          },
          {
            path: "view-group/:id",
            component: ViewGroupComponent,
          },
          {
            path: "redirect/:id",
            component: RedirectComponentComponent,
          },
          {
            path: "rd/:id",
            component: RdComponent,
          },
          {
            path: "add-group-expense/:id",
            component: AddGroupExpenseComponent,
          },
          {
            path: "view-group-expense/:id",
            component: GetGroupExpenseComponent,
          },
        ],
      },
      {
        path: "edit",
        component: UpdateUserComponent,
      },
      {
        path: "banking",
        component: BankingComponent,
      },
      {
        path: "accounts",
        component: AccountComponent,
      },
    ],
  },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
