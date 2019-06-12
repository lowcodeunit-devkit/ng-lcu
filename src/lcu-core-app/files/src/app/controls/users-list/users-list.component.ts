import { UsersService } from './../../services/user.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'lcu-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnDestroy {

  /**
   * Input property for user's list
   */
  // tslint:disable-next-line:no-input-rename
  @Input('users')
  public Users: Array<UserModel>;

  public UserId: number;

  /**
   * allows access to the subscription
   */
  protected queryParamsSubscription: Subscription;

  constructor(protected activatedRouter: ActivatedRoute) { }

  public ngOnInit(): void {
    this. queryParamsSubscription = this.activatedRouter.queryParams.subscribe(queryParams => {
      this.UserId = +queryParams.id;
    });
  }

  public ngOnDestroy(): void {
    this.queryParamsSubscription.unsubscribe();
  }

}
