import { Router } from '@angular/router';
import { UserRolesService } from './user-role.service';

import { UserConstants } from '../utils/constants/user.constants';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { Subject } from 'rxjs/internal/Subject';

const Users: Array<UserModel> = [
    {
        Id: 1,
        FirstName: 'User-One',
        LastName: 'Lastname',
        Username: 'admin',
        Role: UserConstants.USER_ROLE_ADMIN,
        Message: 'Lorem ipsum dolor sit amet.',
        Icon: 'face',
        Password: 'password',
        IsLoggedIn: false
    },
    {
        Id: 2,
        FirstName: 'User-Two',
        LastName: 'Lastname',
        Username: 'user',
        Role: UserConstants.USER_ROLE_USER,
        Message: 'Quis vel eros donec ac odio orci.',
        Icon: 'insert_emoticon',
        Password: 'password',
        IsLoggedIn: false
    },
    {
        Id: 3,
        FirstName: 'User-Three',
        LastName: 'Lastname',
        Username: 'readonly',
        Role: UserConstants.USER_ROLE_READ_ONLY,
        Message: 'Quis vel eros donec ac odio orci.',
        Icon: 'insert_emoticon',
        Password: 'password',
        IsLoggedIn: false
    }
];

@Injectable({
    providedIn: 'root'
})

export class UsersService {

    protected _currentUser: UserModel;

    get CurrentUser(): UserModel {
        return this._currentUser;
    }

    set CurrentUser(val: UserModel) {
        this._currentUser = val;
        this.CurrentUserChanged.next(val);
    }

    constructor(protected route: Router, protected userRolesService: UserRolesService) {}
    /**
     * Notification of user change
     */
    public CurrentUserChanged = new Subject<UserModel>();

    /**
     * Get fake users
     */
    public GetUsers(): Observable<Array<UserModel>> {

        return of(Users);
    }

    /**
     * Return single user
     * 
     * @param id identifier to find user
     */
    public GetUserById(id: number): UserModel {
        // return user by id, use '+' to make sure id is converted to a number
        return Users.find(item => item.Id === +id);
    }

    /**
     * Check if user's logged in
     * 
     * @param id user id
     */
    public IsLoggedIn(): boolean {
        if (!this.CurrentUser) {
            return false;
        }
        return this.CurrentUser.IsLoggedIn;
    }

    /**
     * Check user's role
     */
    public UserRole(): string {
        return this.CurrentUser.Role;
    }

    /**
     * Fake login
     *
     * @param username username to check
     * @param password password to check
     */
    public Login(username: string, password: string): boolean {

        const idx: number = Users.findIndex((user: UserModel) => {

            if (user.Username === username && user.Password === password) {
                this.CurrentUser = user;
                this.CurrentUser.IsLoggedIn = true;
                this.route.navigate(['/dashboard']);
                // if (this.CurrentUser.Role === UserConstants.USER_ROLE_ADMIN) {
                //     this.route.navigate(['/dashboard']);
                // } else if (this.CurrentUser.Role === UserConstants.USER_ROLE_USER) {
                //     this.route.navigate(['/dashboard/user']);
                // }
                return user.Username === username && user.Password === password;
            } else {
                user.IsLoggedIn = false;
            }
        });

        return idx !== -1;
    }

    /**
     * Log current user out
     */
    public Logout(): void {
        this.CurrentUser.IsLoggedIn = false;
        this.route.navigate(['/login']);
    }
}
