import { UsersService } from './../../services/user.service';
import { UserModel } from './../../models/user.model';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserStateModel } from '../../models/user-state-model';
import { UsersStateManagerContext } from '../../state/users/user-state-manager.context';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'lcu-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  /**
   * Current user changed subscription
   */
  protected currentUserSubscription: Subscription;

  /**
   * Routing params subscription
   */
  protected queryParamsSubscription: Subscription;

  /**
   * User
   */
  public User: UserModel;

  /**
   * User state model
   */
  public State: UserStateModel;

  constructor(
    protected activatedRouter: ActivatedRoute,
    protected userService: UsersService,
    protected userCtxt: UsersStateManagerContext) { }

  public ngOnInit(): void {

    this. queryParamsSubscription = this.activatedRouter.queryParams.subscribe(queryParams => {
      this.getUserById(queryParams.id);
    });

    this.currentUserSubscription = this.userService.CurrentUserChanged.subscribe((user: UserModel) => {
      this.User = user;
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
    // Angular will unsubscribe the route observable, but we can still do it ourselves
    this.queryParamsSubscription.unsubscribe();
    this.currentUserSubscription.unsubscribe();
  }

  /**
   * Return single user by id
   * 
   * @param id unique identifier
   */
  protected getUserById(id: number): void {
    this.User = this.userService.GetUserById(id);

    /**
     * Getting the use from the state
     */
    // this.User = this.userCtxt.GetUserById(id);
  }

  /**
   * listen for state change
   */
  protected stateChanged(): void {
    if (!this.State) {
      return;
    }
  }

}
