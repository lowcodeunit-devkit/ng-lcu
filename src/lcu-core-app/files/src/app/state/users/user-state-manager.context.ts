import { UserModel } from './../../models/user.model';
import { Injectable, Injector } from '@angular/core';
import { StateManagerContext } from '@lcu-ide/common';
import { UserStateModel } from '../../models/user-state-model';

@Injectable({
    providedIn: 'root'
  })

/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * Currentyly the state isn't being used, but stubbing pieces of it out in this project
 * When the state is used it shoule eliminate the need for user.service.ts
 * 8/15/2019 - Shannon
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */

  export class UsersStateManagerContext extends StateManagerContext<UserStateModel> {
    //  Fields
  protected state: UserStateModel;

  //  Properties

  //  Constructors
  constructor(protected injector: Injector) {
    super(injector);
  }

  //  API Methods

  /**
   * Get user by their id
   *
   * @param id user id
   */
  public GetUserById(id: number): void {
    this.state.Loading = true;

    this.Execute({
      Arguments: {
        UserId: id
      },
      Type: 'get-user-by-id'
    });
  }

  /**
   * Set the current user
   *
   * @param user user object
   */
  public SetCurrentUser(user: UserModel): void {
    this.state.Loading = true;

    this.Execute({
      Arguments: {
        User: user
      },
      Type: 'set-current-user'
    });
  }

  //  Helpers
  protected defaultValue() {

    return <UserStateModel>{ Loading: true };
  }

  protected async loadStateKey() {
    return 'main';
  }

  protected async loadStateName() {
    return 'users';
  }
}
