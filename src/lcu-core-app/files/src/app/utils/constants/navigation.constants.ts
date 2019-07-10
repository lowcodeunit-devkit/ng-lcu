import { NavLinkModel } from '../../models/nav-link.model';

// @dynamic
/**
 * @dynamic is used because this class contains static properties
 *
 * Used to build the items in the navigation menu
 */

export class NavigationConstants {
    public static readonly MENU_ITEMS: Array<NavLinkModel> = [
        { Label: 'Home', RouterURL: '/home', Icon: 'home'},
        { Label: 'Reactive Form', RouterURL: '/reactiveForm', Icon: 'vertical_split'},
        { Label: 'Tutorials', RouterURL: '/tutorials', Icon: 'school'},
        { Label: 'Angular Flex Layout', RouterURL: '/fxLayout', Icon: 'view_quilt'},
        { Label: 'Dashboard', RouterURL: '/dashboard', Icon: 'dashboard'}
    ]
}