import { Component, Injector } from '@angular/core';
import { ISolutionControl, ForgeGenericSolution } from '@lcu/solutions';

@Component({
	selector: 'forge-solution-<%= dasherize(name) %>-documentation',
	templateUrl: './<%= dasherize(name) %>-documentation.component.html',
	styleUrls: ['./<%= dasherize(name) %>-documentation.component.scss']
})
export class Forge<%= classify(name) %>SolutionDocumentation extends ForgeGenericSolution
	implements ISolutionControl {
	//  Fields

	//  Properties
	public DocsRoot: string;

	//  Constructors
	constructor(protected injector: Injector) {
		super(injector);
		
		this.DocsRoot = 'https://raw.githubusercontent.com/lowcodeunit/lcu-sln-<%= dasherize(name) %>/master/docs/';
	}

	//	Life Cycle

	//	API Methods

	//	Helpers
}
