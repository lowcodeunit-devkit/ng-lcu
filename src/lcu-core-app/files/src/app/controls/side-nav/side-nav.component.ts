import { Component, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavLinkModel } from '../../models/nav-link.model';
import { UserModel } from '../../models/user.model';
import { UsersService } from '../../services/user.service';

@Component({
  selector: 'lcu-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  protected _navLinks: Array<NavLinkModel>;

  public Users: Array<UserModel>;

  /**
   * Input property for logo
   */
  // tslint:disable-next-line:no-input-rename
  @Input('logo-url')
  public LogoURL: string;

  /**
   * Input property for logo alt text
   */
  // tslint:disable-next-line:no-input-rename
  @Input('logo-alt')
  public LogoAlt: string;

  /**
   * Input property for navigation links
   */
  // tslint:disable-next-line:no-input-rename
  @Input('nav-links')
  public NavLinks: Array<NavLinkModel>;

  constructor(protected userService: UsersService, protected breakpointObserver: BreakpointObserver) {}

  public ngOnInit(): void {
    this.userService.GetUsers().subscribe((data: Array<UserModel>) => {
      this.Users = data;
    });
  }
}

