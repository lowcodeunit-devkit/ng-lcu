/**
 * @dynamic is used because this class contains static properties
 *
 * Used to build the items in the navigation menu
 */

export class UserConstants {
    public static readonly USER_ROLE_ADMIN: string = 'admin';

    public static readonly USER_ROLE_CONTRIBUTOR: string = 'contributor';

    public static readonly USER_ROLE_SUBSCRIBER: string = 'subscriber';

    public static readonly USER_ROLE_READ_ONLY: string = 'readonly';
}