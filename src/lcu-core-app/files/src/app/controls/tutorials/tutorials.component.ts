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

  public Tutorials: Array<TutorialModel>;

  protected tutorialDataSubscription: Subscription;

  constructor(protected sharedNotificationService: SharedNotificationService, protected tutorialsService: TutorialService) { }

  public ngOnInit() {
    this.tutorialsService.GetTutorials().subscribe((data: Array<TutorialModel>) => {
      this.Tutorials = data;
    });
  }

  public ngOnDestroy(): void {
    
  }

}
