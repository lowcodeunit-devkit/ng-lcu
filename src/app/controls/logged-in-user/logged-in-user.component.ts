import { UsersStateManagerContext } from './../../state/users/user-state-manager.context';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserModel } from '../../models/user.model';
import { UsersService } from '../../services/user.service';
import { UserStateModel } from '../../models/user-state-model';

@Component({
  selector: 'lcu-logged-in-user',
  templateUrl: './logged-in-user.component.html',
  styleUrls: ['./logged-in-user.component.scss']
})
export class LoggedInUserComponent implements OnInit, OnDestroy {

  /**
   * Current user
   */
  public CurrentUser: UserModel;

  /**
   * Current user changed subscription
   */
  protected currentUserSubscription: Subscription;


  /**
   * User state model
   */
  public State: UserStateModel;

  constructor(
    protected userService: UsersService,
    protected userCtxt: UsersStateManagerContext) { }

  public ngOnInit(): void {
    this.currentUserSubscription = this.userService.CurrentUserChanged.subscribe((user: UserModel) => {
      this.CurrentUser = user;
    });

    // when user state changes
    // this.userCtxt.Context.subscribe(state => {
    //   this.State = state;

    //   if (this.State) {
    //     this.stateChanged();
    //   }
    // });
  }

  public ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  public Logout(): void {
    this.userService.Logout();
  }

  /**
   * when state changes
   */
  protected stateChanged(): void {
   //  this.CurrentUser = this.State.CurrentUser;
  }

}
