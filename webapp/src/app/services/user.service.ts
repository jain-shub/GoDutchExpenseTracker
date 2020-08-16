import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Expense } from "app/model/expense.model";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { UserRegistration } from "../model/user-registartion.model";

/**
 * Service class for the User Registration Component. Works with every component.
 *
 * @author goelsarthak
 */
@Injectable({
  providedIn: "root",
})
export class UserService {
  private users: UserRegistration[] = [];
  private usersUpdated = new Subject<UserRegistration[]>();
  private dashboardUser: UserRegistration;
  private token: string;
  private isAccountClicked: boolean;

  /**
   * Constructor.
   */
  constructor(private http: HttpClient) {}

  // service to call api for getting list of users
  getUserList(): Observable<UserRegistration[]> {
    return this.http.get<UserRegistration[]>("http://localhost:3000/api/posts");
  }

  // service save user in session
  setUserInDashboard(
    user: UserRegistration,
    token: string,
    isAccountCliked: boolean
  ) {
    this.dashboardUser = user;
    this.token = token;
    this.isAccountClicked = isAccountCliked;
  }

  // service to get user from dashboard
  getUserInDashboard() {
    return this.dashboardUser;
  }

  // service method to get token
  getToken() {
    return this.token;
  }

  // function to check if account setting is clicked
  isAccountSettingsClicked() {
    return this.isAccountClicked;
  }

  // service to call api for login of users
  login(email: string, password: string) {
    return this.http.post("http://localhost:3000/v1/login", {
      email,
      password,
    });
  }

  // remove user from local storage to log user out
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
  }

  // service to call api for getting all users
  getAllUsers() {
    this.http
      .get<{ message: string; users: any }>("http://localhost:3000/api/posts")
      .pipe(
        map((userData) => {
          return userData.users.map((user) => {
            return {
              email: user.email,
              userName: user.userName,
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.users = transformedPosts;
        this.usersUpdated.next([...this.users]);
      });
  }

  // getting observable to posting user update
  getPostUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  // getting all details of user
  getUserDetails(userEmail: string) {
    return { ...this.users.find((u) => u.email === userEmail) };
  }

  // service to call api for adding af users
  addUser(
    firstName: string,
    lastName: string,
    userEmail: string,
    password: string
  ) {
    const user: UserRegistration = {
      id:"",
      firstName: firstName,
      lastName: lastName,
      email: userEmail,
      dueExpense: new Expense(),
      owedExpense: new Expense(),
      amountDue: 0,
      amountOwed: 0,
      password: password,
      createdDate: new Date(),
      isVerified: false,
    };
    return this.http.post<UserRegistration>(
      "http://localhost:3000/v1/user",
      user
    );
  }

  // service to call api for updating of users
  updateUser(user: UserRegistration, token: string) {
    return this.http.put<UserRegistration>(
      "http://localhost:3000/v1/user/",
      user
    );
  }

// service to call api for recovery of password
  public recoverPassword(email: string) {
    return this.http.post("http://localhost:3000/v1/recover", { email }).pipe(
      map((data: any) => {
        return data;
      }),
      catchError((error) => {
        return throwError(error.message);
      })
    );
  }

  // service to call api for resetting of password
  public resetPassword(token: string, password: string) {
    return this.http
      .post("http://localhost:3000/v1/reset", { token, password })
      .pipe(
        map((data: any) => {
          return data;
        }),
        catchError((error) => {
          return throwError(error.message);
        })
      );
  }

  // service to call api for getting single user
  public getUser(){
    const token = localStorage.getItem("token");
    return this.http.get<UserRegistration>("http://localhost:3000/v1/user/");
  }
}
