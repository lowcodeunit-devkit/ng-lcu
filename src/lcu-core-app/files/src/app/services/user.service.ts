import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserConstants } from '../utils/constants/user.constants';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { Subject } from 'rxjs/internal/Subject';

const Users: Array<UserModel> = [
    {
        Id: 1,
        FirstName: 'Admin',
        LastName: 'User',
        Username: 'admin',
        Role: UserConstants.USER_ROLE_ADMIN,
        Message: 'Lorem ipsum dolor sit amet.',
        Icon: 'face',
        Password: 'password',
        IsLoggedIn: false
    },
    {
        Id: 2,
        FirstName: 'User',
        LastName: 'User 1',
        Username: 'user',
        Role: UserConstants.USER_ROLE_CONTRIBUTOR,
        Message: 'Quis vel eros donec ac odio orci.',
        Icon: 'insert_emoticon',
        Password: 'password',
        IsLoggedIn: false
    },
    // {
    //     Id: 3,
    //     FirstName: 'Test',
    //     LastName: 'User 2',
    //     Username: 'user2',
    //     Role: UserConstants.USER_ROLE_SUBSCRIBER,
    //     Message: 'Feugiat in ante metus dictum.',
    //     Icon: 'child_care',
    //     Password: 'password',
    //     IsLoggedIn: false
    // },
    // {
    //     Id: 4,
    //     FirstName: 'Test',
    //     LastName: 'User 3',
    //     Username: 'user3',
    //     Role: UserConstants.USER_ROLE_READ_ONLY,
    //     Message: 'Scelerisque varius morbi enim nunc.',
    //     Icon: 'sentiment_satisfied',
    //     Password: 'password',
    //     IsLoggedIn: false
    // },
    // {
    //     Id: 5,
    //     FirstName: 'Test',
    //     LastName: 'User 4',
    //     Username: 'user4',
    //     Role: UserConstants.USER_ROLE_CONTRIBUTOR,
    //     Message: 'Phasellus faucibus scelerisque.',
    //     Icon: 'mood',
    //     Password: 'password',
    //     IsLoggedIn: false
    // }
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

    constructor(protected route: Router) {}
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
                // } else if (this.CurrentUser.Role === UserConstants.USER_ROLE_CONTRIBUTOR) {
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
