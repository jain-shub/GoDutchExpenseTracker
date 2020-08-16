import { Injectable } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";
import { Observable } from "rxjs";
import { Subject } from "rxjs";

/**
 * Service class for the Alert Component. Works with every component.
 *
 * @author goelsarthak
 */
@Injectable({
  providedIn: "root",
})
export class AlertService {
  private subject = new Subject<any>();
  private keepAfterNavigationChange = false;

  /**
   * Constructor.
   */
  constructor(private router: Router) {
    // clear alert message on route change
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          // only keep for a single location change
          this.keepAfterNavigationChange = false;
        } else {
          // clear alert
          this.subject.next();
        }
      }
    });
  }

  /**
   * Success Method to display the success message
   *
   */
  success(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: "success", text: message });
  }

  /**
   * Method to display the error message
   *
   */
  error(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: "error", text: message });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
