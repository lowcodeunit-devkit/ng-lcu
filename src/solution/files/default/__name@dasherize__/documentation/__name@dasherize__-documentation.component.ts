import { Component, Injector } from '@angular/core';
import { ISolutionControl, ForgeGenericSolution } from '@lowcodeunit/solutions';

@Component({
	selector: 'forge-solution-<%= dasherize(name) %>-documentation',
	templateUrl: './<%= dasherize(name) %>-documentation.component.html',
	styleUrls: ['./<%= dasherize(name) %>-documentation.component.scss']
})
export class Forge<%= classify(name) %>SolutionDocumentation extends ForgeGenericSolution
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
