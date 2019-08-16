import { Component, OnInit, Input } from '@angular/core';
import { NavLinkModel } from '../../models/nav-link.model';

@Component({
  selector: 'lcu-nav-list',
  templateUrl: './nav-list.component.html',
  styleUrls: ['./nav-list.component.scss']
})
export class NavListComponent implements OnInit {

  /**
   * Input property for navigation links
   */
  // tslint:disable-next-line:no-input-rename
  @Input('nav-links')
  public NavLinks: Array<NavLinkModel>;
  
  constructor() { }

  ngOnInit() {
  }

}
