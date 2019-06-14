/**
 * Model for naviation link structure
 */
export class NavLinkModel {

    /**
     * Menu icon
     */
    public Icon?: string;

    /**
     * Menu label
     */
    public Label: string;

    /**
     * Menu parameter
     */
    public Param?: object;

    /**
     * Navigation URL
     */
    public RouterURL: string;

    constructor(label: string, rounterURL: string, icon?: string, param?: object) {
        this.Icon = icon;
        this.Label = label;
        this.RouterURL = rounterURL;
        this.Param = param;
    }
}