import { LayoutModule } from "@angular/cdk/layout";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import {
  ErrorStateMatcher,
  MatNativeDateModule,
  ShowOnDirtyErrorStateMatcher,
} from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MDBBootstrapModule } from "angular-bootstrap-md";
import { NgxPlaidLinkModule } from "ngx-plaid-link";
import { AccountComponent } from "./account/account.component";
import { AlertComponent } from "./alert/alert.component";
import { AppRoutingModule } from "./app-routing/app-routing.module";
import { AppComponent } from "./app.component";
import { BankingComponent } from "./banking/banking.component";
import { AppFooterComponent } from "./core/app-footer/app-footer.component";
import { AppHeaderComponent } from "./core/app-header/app-header.component";
import { AddExpenseComponent } from "./expense/add-expense/add-expense.component";
import { GetExpenseComponent } from "./expense/get-expense/get-expense.component";
import { RedirectComponentComponent } from "./expense/redirect-component/redirect-component.component";
import { AddGroupExpenseComponent } from "./group-expense/add-group-expense/add-group-expense.component";
import { GetGroupExpenseComponent } from "./group-expense/get-group-expense/get-group-expense.component";
import { RdComponent } from "./group-expense/rd/rd.component";
import { AddGroupComponent } from "./group/add-group/add-group.component";
import { GetAllGroupComponent } from "./group/get-all-group/get-all-group.component";
import { ViewGroupComponent } from "./group/view-group/view-group.component";
import { HomeComponent } from "./home-component/home-component.component";
import { AuthInterceptor } from "./interceptor/auth.interceptor";
import { HttpErrorInterceptor } from "./interceptor/http-error.interceptor";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { DashboardComponent } from "./user/dashboard/dashboard.component";
import { LoginComponent } from "./user/login/login.component";
import { PasswordResetComponent } from "./user/password-reset/password-reset.component";
import { SignUpComponent } from "./user/sign-up/sign-up.component";
import { UpdateUserComponent } from "./user/update-user/update-user.component";
import { UserPagesComponent } from "./user/user-pages/user-pages.component";
import { ViewMaterialModule } from "./view-material/view-material.module";
import { SettleComponent } from './group-expense/settle/settle.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    HomeComponent,
    LoginComponent,
    PasswordResetComponent,
    DashboardComponent,
    AppHeaderComponent,
    AppFooterComponent,
    UpdateUserComponent,
    AlertComponent,
    AddExpenseComponent,
    AddGroupComponent,
    ViewGroupComponent,
    GetExpenseComponent,
    UserPagesComponent,
    PageNotFoundComponent,
    GetAllGroupComponent,
    AddGroupExpenseComponent,
    GetGroupExpenseComponent,
    BankingComponent,
    AccountComponent,
    DashboardComponent,
    RedirectComponentComponent,
    RdComponent,
    SettleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ViewMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatGridListModule,
    MDBBootstrapModule,
    LayoutModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    HttpClientModule,
    MatCardModule,
    MatDialogModule,
    NgxPlaidLinkModule,
    MatSelectModule,
    MatMenuModule,
    MatExpansionModule,
    MatTabsModule,
    MatTableModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [ViewMaterialModule],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: "fill" },
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddGroupComponent, ViewGroupComponent, SettleComponent],
})
export class AppModule {}
