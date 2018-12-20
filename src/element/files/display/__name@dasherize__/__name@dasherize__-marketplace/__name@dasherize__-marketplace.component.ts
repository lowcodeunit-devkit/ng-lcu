import { Component, Injector } from '@angular/core';
import { IControlMarketplace } from '@lcu/elements';
import { ForgeGenericControl } from '@lcu/daf-ui';
import { Forge<%= classify(name) %>Details, Forge<%= classify(name) %>Config } from '../<%= dasherize(name) %>.core';

@Component({
	selector: 'forge-<%= dasherize(name) %>-marketplace',
	templateUrl: './<%= dasherize(name) %>-marketplace.component.html',
	styleUrls: ['./<%= dasherize(name) %>-marketplace.component.scss']
})
export class Forge<%= classify(name) %>MarketplaceComponent
	extends ForgeGenericControl<Forge<%= classify(name) %>Details, Forge<%= classify(name) %>Config>
	implements IControlMarketplace<Forge<%= classify(name) %>Details, Forge<%= classify(name) %>Config> {
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
