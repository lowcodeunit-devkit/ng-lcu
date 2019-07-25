export class ParseRouteUtil {

    /**
     * Return only the base of the route url
     *
     * @param route routing url
     */
    public static parse(route: string): string {

        /**
         * Check if route has parameters and remove them
         */
        if (route.indexOf('?') !== -1) {
            route = route.substring(0, route.indexOf('?'));
        }

        /**
         * Remove '/' in route
         */
        route = route.replace('/', '');

        return route;
    }
}