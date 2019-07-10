import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lcu-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  /**
   * propery for form subtitle
   */
  public PageTitle: string;

  constructor(protected route: Router, protected activatedRoute: ActivatedRoute) {
    this.PageTitle = 'Dashboard';
  }

  ngOnInit() {
    // this.route.
  }

  /**
   * Show admin component
   */
  public ShowAdmin(): void {
    this.route.navigate(['admin'], {relativeTo: this.activatedRoute });
  }

  /**
   * Show user component
   */
  protected showUser(): void {
    this.route.navigate(['user'], {relativeTo: this.activatedRoute });
  }

}
