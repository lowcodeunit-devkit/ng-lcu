import { Component, Injector } from '@angular/core';
import { ISolutionControl, ForgeGenericSolution } from '@lowcodeunit/solutions';


@Component({
    selector: 'forge-solution-<%= dashify(name) %>-manage',
    templateUrl: './<%= dashify(name) %>-manage.component.html',
    styleUrls: ['./<%= dashify(name) %>-manage.component.scss']
})
export class Forge<%= classify(name) %>SolutionManage extends ForgeGenericSolution
    implements ISolutionControl {
    //  Fields

    //  Properties

    //  Constructors
	constructor(protected injector: Injector) {
        super(injector);
    }

    //	Life Cycle

    //	API Methods

    //	Helpers
}   
