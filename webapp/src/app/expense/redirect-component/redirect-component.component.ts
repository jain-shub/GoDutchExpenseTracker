import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";


@Component({
  selector: 'app-redirect-component',
  templateUrl: './redirect-component.component.html',
  styleUrls: ['./redirect-component.component.scss']
})
export class RedirectComponentComponent implements OnInit {
  id:any;

  constructor(private router: Router,private activatedroute: ActivatedRoute)  { }

  // Redirecting to correct url
  ngOnInit(): void {
    this.activatedroute.params.subscribe((params) => {
      this.id = params["id"];
    });
      // tslint:disable-next-line: triple-equals
    if(this.id == 'user') {
      this.router.navigate(['/user/dashboard/user-expense']);
      }
      else {
        this.router.navigate(['/user/dashboard/view-group/', this.id]);
      }
  }

}
