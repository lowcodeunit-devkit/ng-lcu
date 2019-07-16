import { UsersService } from './../../services/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'lcu-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent implements OnDestroy {
  cols: {[key: string]: string} = {
    firstCol: 'row',
    firstColXs: 'column',
    firstColMd: 'column',
    firstColLg: 'invalid',
    firstColGtLg: 'column',
    secondCol: 'column'
  };
  isVisible = true;

  /**
   * Title
   */
  public PageTitle: string;

  /**
   * propery for form title icon
   */
  public TitleIcon: string;

  /**
   * propery for form subtitle
   */
  public SubTitle: string;


  protected activeMQC: MediaChange[];
  protected subscription: Subscription;

  constructor(protected mediaService: MediaObserver, protected usersService: UsersService) {
    this.subscription = mediaService.asObservable()
      .subscribe((events: MediaChange[]) => {
        this.activeMQC = events;
      });

    this.PageTitle = 'Admin Dashboard Area';
    this.TitleIcon = 'accessibility';
    this.SubTitle = 'Your permission level is: ' + this.usersService.CurrentUser.Role;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public ToggleLayoutFor(col: number): void {
    this.activeMQC.forEach((change: MediaChange) => {
      switch (col) {
        case 1:
            const set1 = `firstCol${change ? change.suffix : ''}`;
            this.cols[set1] = (this.cols[set1] === 'column') ? 'row' : 'column';
            break;

        case 2:
          const set2 = 'secondCol';
          this.cols[set2] = (this.cols[set2] === 'row') ? 'column' : 'row';
          break;
      }
    });
  }
}

