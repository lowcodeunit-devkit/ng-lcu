import { Component, Injector } from '@angular/core';
import { ForgeGenericSolution, ISolutionControl } from '@lowcodeunit/solutions';

@Component({
	selector: 'forge-solution-<%= dasherize(name) %>-overview',
	templateUrl: './<%= dasherize(name) %>-overview.component.html',
	styleUrls: ['./<%= dasherize(name) %>-overview.component.scss']
})
export class Forge<%= classify(name) %>SolutionOverview extends ForgeGenericSolution
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
