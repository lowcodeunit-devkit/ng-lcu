import { UsersService } from './../../services/user.service';
import { UserModel } from './../../models/user.model';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

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

  constructor(protected activatedRouter: ActivatedRoute, protected userService: UsersService) { }

  public ngOnInit(): void {

    this. queryParamsSubscription = this.activatedRouter.queryParams.subscribe(queryParams => {
      this.getUserById(queryParams.id);
    });

    this.currentUserSubscription = this.userService.CurrentUserChanged.subscribe((user: UserModel) => {
      this.User = user;
    });
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
  }

}
