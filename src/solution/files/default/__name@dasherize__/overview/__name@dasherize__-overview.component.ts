import { Component, Injector } from '@angular/core';
import { ForgeGenericSolution, ISolutionControl } from '@lowcodeunit/solutions';

@Component({
	selector: 'forge-solution-<%= dashify(name) %>-overview',
	templateUrl: './<%= dashify(name) %>-overview.component.html',
	styleUrls: ['./<%= dashify(name) %>-overview.component.scss']
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
