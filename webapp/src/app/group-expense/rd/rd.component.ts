import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-rd',
  templateUrl: './rd.component.html',
  styleUrls: ['./rd.component.scss']
})
export class RdComponent implements OnInit {
  id: any;
  constructor(private router: Router,private activatedroute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedroute.params.subscribe((params) => {
      this.id = params["id"];

    });
    this.router.navigate(['/user/dashboard/view-group-expense/', this.id]);
  }

}
