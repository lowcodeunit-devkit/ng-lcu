import { Component, Injector } from '@angular/core';
import { IControlRender } from '@lcu/elements';
import { ForgeGenericControl } from '@lcu/daf-ui';
import { Forge<%= classify(name) %>Details, Forge<%= classify(name) %>Config } from '../<%= dasherize(name) %>.core';

@Component({
	selector: 'forge-<%= dasherize(name) %>-render',
	templateUrl: './<%= dasherize(name) %>-render.component.html',
	styleUrls: ['./<%= dasherize(name) %>-render.component.scss']
})
export class Forge<%= classify(name) %>RenderComponent
	extends ForgeGenericControl<Forge<%= classify(name) %>Details, Forge<%= classify(name) %>Config>
	implements IControlRender<Forge<%= classify(name) %>Details, Forge<%= classify(name) %>Config> {
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
