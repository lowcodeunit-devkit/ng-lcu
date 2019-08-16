import { Subscription } from 'rxjs';

import { Component, OnInit, OnDestroy } from '@angular/core';

import { TutorialModel } from '../../models/tutorial.model';
import { SharedNotificationService } from '../../services/shared-notification.service';
import { TutorialService } from '../../services/tutorial.service';


@Component({
  selector: 'lcu-tutorials',
  templateUrl: './tutorials.component.html',
  styleUrls: ['./tutorials.component.scss']
})
export class TutorialsComponent implements OnInit, OnDestroy {

  /**
   * Title
   */
  public PageTitle: string;

  /**
   * Subtitle
   */
  public SubTitle: string;

  /**
   * Title
   */
  public Title: string;

  /**
   * Title Icon
   */
  public TitleIcon: string;

  /**
   * Tutorial Array
   */
  public Tutorials: Array<TutorialModel>;

  protected tutorialDataSubscription: Subscription;

  constructor(protected sharedNotificationService: SharedNotificationService, protected tutorialsService: TutorialService) { 
    this.PageTitle = 'Tutorials';
    this.Title = 'Angular Tutorials';
    this.SubTitle = 'List of Tutorials';
    this.TitleIcon = 'school';
  }

  public ngOnInit() {
    this.tutorialsService.GetTutorials().subscribe((data: Array<TutorialModel>) => {
      this.Tutorials = data;
    });
  }

  public ngOnDestroy(): void {
    
  }

}
