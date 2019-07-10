import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserModel } from '../../models/user.model';
import { UsersService } from '../../services/user.service';

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


  constructor(protected userService: UsersService) { }

  public ngOnInit(): void {
    this.currentUserSubscription = this.userService.CurrentUserChanged.subscribe((user: UserModel) => {
      this.CurrentUser = user;
    });
  }

  public ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  public Logout(): void {
    this.userService.Logout();
  }

}
