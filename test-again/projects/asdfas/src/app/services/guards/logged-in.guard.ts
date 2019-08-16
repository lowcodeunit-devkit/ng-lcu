import { UsersService } from '../user.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
    providedIn: 'root'
})

export class LoggedInGuard implements CanActivate {
    constructor(protected usersService: UsersService, protected route: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
        console.log(route);
        if (this.usersService.IsLoggedIn()) {
            return true;
        } else {
            window.alert('You must sign in to access this page');
            this.route.navigate(['/login']);
            return false;
        }

    }
}