export class TutorialModel {

    /**
     * Tutorial id
     */
    public Id: number;

    /**
     * Tutorial Label
     */
    public Label: string;

    /**
     * Tutorial Target
     */
    public Target: string;

    /**
     * Tutorial Url
     */
    public Url: string;

    /**
     * 
     * @param id user id
     * 
     * @param name user name
     * 
     * @param role user role
     */
    constructor(label: string, url: string, target: string = '_blank') {
        this.Label = label;
        this.Target = url;
        this.Url = target;
    }
}