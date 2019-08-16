import { UsersService } from '../user.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { UserConstants } from '../../utils/constants/user.constants';

@Injectable({
    providedIn: 'root'
})

export class UserRoleNonAdminGuard implements CanActivate {
    constructor(protected usersService: UsersService, protected route: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
        const userRole: string = this.usersService.UserRole();

        if (userRole !== UserConstants.USER_ROLE_ADMIN || userRole !== UserConstants.USER_ROLE_USER) {
            return true;
        } else {
            window.alert('You must have admin or contributor permissions to access');
            return false;
        }
    }
}