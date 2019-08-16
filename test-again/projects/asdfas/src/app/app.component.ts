import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {OverlayContainer} from '@angular/cdk/overlay';

import { Subscription } from 'rxjs';
import { NavigationConstants } from './utils/constants/navigation.constants';

import { NavLinkModel } from './models/nav-link.model';
import { SharedNotificationService } from './services/shared-notification.service';
import { TutorialService } from './services/tutorial.service';
import { ParseRouteUtil } from './utils/parse-route.utils';
import { TutorialModel } from './models/tutorial.model';
import { ToggleThemeUtil } from './utils/toggle-theme.utils';
import { FaviconsService } from './services/favicons.service';



@Component({
  selector: 'lcu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  public BackgroundImage: string;

  public DarkTheme: boolean;

  public Links: Array<NavLinkModel>;

  public SelectedTheme: string;

  public title = 'demo';

  protected themesSubscriptions: Subscription;

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected sharedNotificationService: SharedNotificationService,
    protected tutorialsService: TutorialService,
    protected overlayContainer: OverlayContainer,
    protected faviconsService: FaviconsService) {

    this.BackgroundImage = './assets/images/bg_image.jpg';
  }

  public ngOnInit(): void {
    this.Links = NavigationConstants.MENU_ITEMS;

    this.themesSubscriptions = this.sharedNotificationService.ThemeChanged.subscribe((val: string) => {
      this.changeTheme(val);
    });

    this.resetTheme();
    this.resetFavicon();
  }

  /**
   * Component loaded when routes change
   * 
   * @param evt router event
   */
  public OnActivate(evt: Event): void {
    this.routeChanged();
  }

   /**
    * Set default favicon
    */
    protected resetFavicon(): void {
      this.faviconsService.reset();
    }

  /**
   * change favicon
   *
   * @param name favicon name
   */
  protected changeFavicon( name: string ): void {
    this.faviconsService.activate(name);
  }

  /**
   * Set default theme
   */
  protected resetTheme(): void {
    this.changeTheme('sea-green-theme');
  }

  /**
   * Toggle themes
   *
   * @param val theme to change to
   */
  protected changeTheme(val: string): void {
    this.SelectedTheme = val;

    const element: HTMLElement = this.overlayContainer.getContainerElement();
    const classList: DOMTokenList = element.classList;

    const toggleTheme: ToggleThemeUtil = new ToggleThemeUtil();
    classList.add(ToggleThemeUtil.Toggle(element.classList, val));

    // update favicon when theme changes
    this.changeFavicon(this.SelectedTheme);
 }

  protected routeChanged(): void {

    const root: string = ParseRouteUtil.parse(this.router.url);

    switch (root.toUpperCase()) {
      case 'HOME':
        this.BackgroundImage = './assets/images/bg_image.jpg';
        break;
      case 'USER':
        this.BackgroundImage = './assets/images/bg-01.jpg';
        break;
      case 'TUTORIALS':
        this.BackgroundImage = './assets/images/bg-02.jpg';
        this.tutorialsService.GetTutorials().subscribe((data: Array<TutorialModel>) => {
          this.sharedNotificationService.UpdateTutorialData(data);
        });
        break;
      case 'REACTIVEFORM':
        this.BackgroundImage = './assets/images/bg-03.jpg';
        break;
      case 'FXLAYOUT':
        this.BackgroundImage = './assets/images/bg-04.jpg';
        break;
        default:
        this.BackgroundImage = './assets/images/bg_image.jpg';
    }
  }
}
