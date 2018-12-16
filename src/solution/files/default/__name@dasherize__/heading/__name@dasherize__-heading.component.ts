import { Component, Injector } from '@angular/core';
import { ForgeGenericSolution, ISolutionControl } from '@lowcodeunit/solutions';

@Component({
	selector: 'forge-solution-<%= dasherize(name) %>-heading',
	templateUrl: './<%= dasherize(name) %>-heading.component.html',
	styleUrls: ['./<%= dasherize(name) %>-heading.component.scss']
})
export class Forge<%= classify(name) %>SolutionHeading extends ForgeGenericSolution
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
