import { UserConstants } from '../utils/constants/user.constants';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';

const Users: Array<UserModel> = [
    {
        Id: 1,
        Name: 'User 1',
        Role: UserConstants.USER_ROLE_ADMIN,
        Message: 'Lorem ipsum dolor sit amet.',
        Icon: 'face'},
    {
        Id: 2,
        Name: 'User 2',
        Role: UserConstants.USER_ROLE_CONTRIBUTOR,
        Message: 'Quis vel eros donec ac odio orci.',
        Icon: 'insert_emoticon'
    },
    {
        Id: 3,
        Name: 'User 3',
        Role: UserConstants.USER_ROLE_SUBSCRIBER,
        Message: 'Feugiat in ante metus dictum.',
        Icon: 'child_care'
    },
    {
        Id: 4,
        Name: 'User 4',
        Role: UserConstants.USER_ROLE_READ_ONLY,
        Message: 'Scelerisque varius morbi enim nunc.',
        Icon: 'sentiment_satisfied'
    },
    {
        Id: 5,
        Name: 'User 5',
        Role: UserConstants.USER_ROLE_CONTRIBUTOR,
        Message: 'Phasellus faucibus scelerisque.',
        Icon: 'mood'
    }
];

@Injectable({
    providedIn: 'root'
})

export class UsersService {

    protected user: Array<UserModel>;
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
}
