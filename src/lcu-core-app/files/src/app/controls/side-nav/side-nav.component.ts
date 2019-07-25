import { Component, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavLinkModel } from '../../models/nav-link.model';
import { UserModel } from '../../models/user.model';
import { UsersService } from '../../services/user.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { SharedNotificationService } from '../../services/shared-notification.service';
import { ThemeModel } from '../../models/theme.model';

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

  public Form: FormGroup;

  public Themes: Array<ThemeModel>;

  public Users: Array<UserModel>;

  /**
   * Access terms field
   */
  public get ThemesControl(): AbstractControl {
    return this.Form.get('themesControl');
  }

  /**
   * Input property for logo
   */
  // tslint:disable-next-line:no-input-rename
  @Input('logo-url')
  public LogoURL: string;

  // tslint:disable-next-line:no-input-rename
  @Input('logo-class')
  public LogoClass: string;

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

  constructor(
    protected userService: UsersService,
    protected breakpointObserver: BreakpointObserver,
    protected sharedNotificationService: SharedNotificationService) {}

  public ngOnInit(): void {
    // this.userService.GetUsers().subscribe((data: Array<UserModel>) => {
    //   this.Users = data;
    // });

    this.setupForm();

    this.setThemes();
  }

  /**
   * Change theme
   * 
   * @param evt theme type
   */
  public SelectTheme(evt: string): void {
    this.sharedNotificationService.ChangeTheme(evt);
  }

  protected setupForm(): void {
    this.Form = new FormGroup({
      themesControl: new FormControl('sea-green-theme')
    });
  }

  protected setThemes(): void {
    this.Themes = [
      { Color: 'primary-arctic', Icon: 'fiber_manual_record', Label: 'Arctic Theme', Value: 'arctic-theme' },
      { Color: '', Icon: 'fiber_manual_record', Label: 'Contrast Theme', Value: 'contrast-theme' },
      { Color: '', Icon: 'fiber_manual_record', Label: 'Cool Candy Theme', Value: 'cool-candy-theme' },
      { Color: '', Icon: 'fiber_manual_record', Label: 'Flipper Theme', Value: 'flipper-theme' },
      { Color: '', Icon: 'fiber_manual_record', Label: 'Ice Theme', Value: 'ice-theme' },
      { Color: '', Icon: 'fiber_manual_record', Label: 'Sea Green Theme', Value: 'sea-green-theme' },
      { Color: '', Icon: 'fiber_manual_record', Label: 'White Mint Theme', Value: 'white-mint-theme' }
  ];
  }
}

