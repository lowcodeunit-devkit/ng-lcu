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

  public User: UserModel;

  protected paramsSubscription: Subscription;

  protected queryParamsSubscription: Subscription;

  constructor(protected activatedRouter: ActivatedRoute, protected userService: UsersService) { }

  public ngOnInit(): void {

    this. queryParamsSubscription = this.activatedRouter.queryParams.subscribe(queryParams => {
      this.getUserById(queryParams.id);
    });

    // This will only happen once, when the component is loaded
    // this.User = new UserModel(
    //   this.activatedRouter.snapshot.params.id,
    //   this.activatedRouter.snapshot.params.name,
    //   this.activatedRouter.snapshot.params.role);

     // Use this if the params will change when the component is already loaded
     // If the component will never be sent new data, then don't do this
    // this.paramsSubscription = this.activatedRouter.params.subscribe((params: Params) => {
    //   this.User.Id = params.id;
    //   this.User.Name = params.name;
    //   this.User.Role = params.role;
    // });
  }

  public ngOnDestroy(): void {
    // Angular will unsubscribe the route observable, but we can still do it ourselves
    // this.paramsSubscription.unsubscribe();
    this.queryParamsSubscription.unsubscribe();
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
