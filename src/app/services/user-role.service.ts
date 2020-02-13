import { Injectable } from '@angular/core';
import { scan } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

export interface Role {
  name: string;
}

@Injectable({
    providedIn: 'root'
})

export class UserRolesService {
  // A stream that exposes all the roles a user has
  roles$ = new ReplaySubject<string[]>(1);

  // We leverage this roleUpdates$ to be able to update the roles
  // This is for demonstration purposes only
  roleUpdates$ = new BehaviorSubject(['basic']);

  constructor() {
    this.roleUpdates$
      .pipe(
        scan((acc, next) => next, [])
      )
      .subscribe(this.roles$);
  }

  public UpdateRoles(roles): void {
    this.roleUpdates$.next(roles);
  }
}
