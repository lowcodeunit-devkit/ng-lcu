import { NgModule } from '@angular/core';

import { FathymSharedModule } from '@lcu/common';
import { BaseDisplayModule } from '@lcu/elements';
import { Forge<%= classify(name) %>BuilderComponent } from './<%= dasherize(name) %>-builder/<%= dasherize(name) %>-builder.component';
import { Forge<%= classify(name) %>MarketplaceComponent } from './<%= dasherize(name) %>-marketplace/<%= dasherize(name) %>-marketplace.component';
import { Forge<%= classify(name) %>RenderComponent } from './<%= dasherize(name) %>-render/<%= dasherize(name) %>-render.component';

export class Forge<%= classify(name) %>DisplayModule extends BaseDisplayModule {
	public Builder() {
		return Forge<%= classify(name) %>BuilderComponent;
	}

	public Marketplace() {
		return Forge<%= classify(name) %>MarketplaceComponent;
	}

	public Render() {
		return Forge<%= classify(name) %>RenderComponent;
	}
}

var comps = [
	Forge<%= classify(name) %>BuilderComponent,
	Forge<%= classify(name) %>MarketplaceComponent,
	Forge<%= classify(name) %>RenderComponent,
];

@NgModule({
	imports: [
		FathymSharedModule,
	],
	declarations: [
		...comps,
	],
	exports: [
		...comps,
	],
	entryComponents: [
		...comps,
	]
})
export class Forge<%= classify(name) %>Module { }
