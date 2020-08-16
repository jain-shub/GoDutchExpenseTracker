import { Component, OnInit } from "@angular/core";
import { AlertService } from "../services/alert.service";

/**
 * Alert Component Class. Gives Toast Alerts.
 *
 * @author goelsarthak
 */
@Component({
  selector: "app-alert",
  templateUrl: "./alert.component.html",
  styleUrls: ["./alert.component.scss"],
})
export class AlertComponent implements OnInit {
  message: any;
  displayMessage: string;

  /**
   * Constructor
   *
   * @param alertService
   */
  constructor(private alertService: AlertService) {}

  /**
   * Displays either the success message or error message.
   */
  ngOnInit() {
    this.alertService.getMessage().subscribe((message) => {
      this.message = message;
      if(this.message){
        this.displayMessage = message.text;
        //this.displayMessage = message.text.statusText;
      }
    });
  }
}
