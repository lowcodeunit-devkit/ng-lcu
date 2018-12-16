import { Component, Injector } from '@angular/core';
import { ForgeGenericSolution, ISolutionControl } from '@lowcodeunit/solutions';

@Component({
	selector: 'forge-solution-<%= dasherize(name) %>-marketplace',
	templateUrl: './<%= dasherize(name) %>-marketplace.component.html',
	styleUrls: ['./<%= dasherize(name) %>-marketplace.component.scss']
})
export class Forge<%= classify(name) %>SolutionMarketplace extends ForgeGenericSolution
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
