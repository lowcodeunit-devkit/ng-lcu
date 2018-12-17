import { Component, Injector } from '@angular/core';
import { ISolutionControl, ForgeGenericSolution } from '@lcu/solutions';


@Component({
    selector: 'forge-solution-<%= dasherize(name) %>-manage',
    templateUrl: './<%= dasherize(name) %>-manage.component.html',
    styleUrls: ['./<%= dasherize(name) %>-manage.component.scss']
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
