import { UserRolesService } from './../user-role.service';
import { UsersService } from '../user.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { UserConstants } from '../../utils/constants/user.constants';

@Injectable({
    providedIn: 'root'
})

export class UserRoleAdminGuard implements CanActivate {
    constructor(protected usersService: UsersService, protected userRolesService: UserRolesService, protected route: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {

        if (this.usersService.UserRole() === UserConstants.USER_ROLE_ADMIN ) {
            return true;
        } else {
            window.alert('You must have admin permissions to access the dashboard, redirecting to home.');
            this.route.navigate(['/home']);
            return false;
        }
    }

    // canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    //     if (this.usersService.UserRole() === UserConstants.USER_ROLE_ADMIN ||
    //     this.usersService.UserRole() === UserConstants.USER_ROLE_USER) {
    //         return true;
    //      } else {
    //         window.alert('You must have admin permissions');
    //         return false;
    //      }

    // }
}