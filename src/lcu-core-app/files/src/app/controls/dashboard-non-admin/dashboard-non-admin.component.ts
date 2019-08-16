import { UsersService } from './../../services/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserStateModel } from '../../models/user-state-model';
import { UsersStateManagerContext } from '../../state/users/user-state-manager.context';

@Component({
  selector: 'lcu-dashboard-non-admin',
  templateUrl: './dashboard-non-admin.component.html',
  styleUrls: ['./dashboard-non-admin.component.scss']
})
export class DashboardNonAdminComponent implements OnInit, OnDestroy {
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
   * User state model
   */
  public State: UserStateModel;

  /**
   * propery for form subtitle
   */
  public SubTitle: string;

  /**
   * propery for form title icon
   */
  public TitleIcon: string;

  protected activeMQC: MediaChange[];
  protected subscription: Subscription;

  constructor(
    protected mediaService: MediaObserver,
    protected usersService: UsersService,
    protected userCtxt: UsersStateManagerContext) {

    this.subscription = mediaService.asObservable()
      .subscribe((events: MediaChange[]) => {
        this.activeMQC = events;
      });

    this.PageTitle = 'User Dashboard Area';
    this.TitleIcon = 'lock';
    this.SubTitle = 'Your permission level is: ' + this.usersService.CurrentUser.Role;
  }

  public ngOnInit(): void {
    // when user state changes
    // this.userCtxt.Context.subscribe(state => {
    //   this.State = state;

    //   if (this.State) {
    //     this.stateChanged();
    //   }
    // });
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

  /**
   * when state changes
   */
  protected stateChanged(): void {
    // this.SubTitle = 'Your permission level is: ' + this.State.CurrentUser.Role;
  }
}
