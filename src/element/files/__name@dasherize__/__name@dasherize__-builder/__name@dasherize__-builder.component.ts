import { Component, Injector } from '@angular/core';
import { IControlBuilder, ForgeGenericControl } from '@lowcodeunit/elements';
import { Forge<%= classify(name) %>Details, Forge<%= classify(name) %>Config } from '../<%= dasherize(name) %>.core';

@Component({
	selector: 'forge-<%= dasherize(name) %>-builder',
	templateUrl: './<%= dasherize(name) %>-builder.component.html',
	styleUrls: ['./<%= dasherize(name) %>-builder.component.scss']
})
export class Forge<%= classify(name) %>BuilderComponent
	extends ForgeGenericControl<Forge<%= classify(name) %>Details, Forge<%= classify(name) %>Config>
	implements IControlBuilder<Forge<%= classify(name) %>Details, Forge<%= classify(name) %>Config> {
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
