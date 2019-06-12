import { NavigationConstants } from './utils/constants/navigation.constants';

import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavLinkModel } from './models/nav-link.model';
import { SharedNotificationService } from './services/shared-notification.service';
import { TutorialService } from './services/tutorial.service';
import { ParseRouteUtil } from './utils/parse-route.utils';
import { TutorialModel } from './models/tutorial.model';


@Component({
  selector: 'lcu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  public BackgroundImage: string;

  public Links: Array<NavLinkModel>;

  public title = 'demo';

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected sharedNotificationService: SharedNotificationService,
    protected tutorialsService: TutorialService) {

    this.BackgroundImage = '../assets/images/bg_image.jpg';
  }

  public ngOnInit(): void {
    this.Links = NavigationConstants.MENU_ITEMS;
  }

  /**
   * Component loaded when routes change
   * 
   * @param evt router event
   */
  public OnActivate(evt: Event): void {
    this.routeChanged();
  }

  protected routeChanged(): void {

    const root: string = ParseRouteUtil.parse(this.router.url);

    switch (root.toUpperCase()) {
      case 'HOME':
        this.BackgroundImage = '../assets/images/bg_image.jpg';
        break;
      case 'USER':
        this.BackgroundImage = '../assets/images/bg-01.jpg';
        break;
      case 'TUTORIALS':
        this.BackgroundImage = '../assets/images/bg-02.jpg';
        this.tutorialsService.GetTutorials().subscribe((data: Array<TutorialModel>) => {
          this.sharedNotificationService.UpdateTutorialData(data);
        });
        break;
      case 'REACTIVEFORM':
        this.BackgroundImage = '../assets/images/bg-03.jpg';
        break;
      case 'FXLAYOUT':
        this.BackgroundImage = '../assets/images/bg-04.jpg';
        break;
        default:
        this.BackgroundImage = '../assets/images/bg_image.jpg';
    }
  }
}
