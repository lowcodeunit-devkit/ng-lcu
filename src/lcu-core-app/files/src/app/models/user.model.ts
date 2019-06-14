export class UserModel {

    /**
     * User icon (avatar)
     */
    public Icon?: string;

    /**
     * User id
     */
    public Id: number;

    /**
     * User message
     */
    public Message: string;

    /**
     * User name
     */
    public Name: string;

    /**
     * User Role
     */
    public Role: string;

    /**
     * 
     * @param id user id
     * 
     * @param name user name
     * 
     * @param role user role
     */
    constructor(id: number, name: string, role: string, message: string, icon?: string) {
        this.Id = id;
        this.Message = message;
        this.Name = name;
        this.Role = role;
        this.Icon = icon;
    }
}