import { NgModule } from '@angular/core';

import { FathymSharedModule } from '@lowcodeunit/common';
import { Forge<%= classify(name) %>BuilderComponent } from './<%= dasherize(name) %>-builder.component';
import { Forge<%= classify(name) %>MarketplaceComponent } from './content-marketplace.component';
import { Forge<%= classify(name) %>RenderComponent } from './content-render.component';
import { BaseDisplayModule } from '../../../builders.types';
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MonacoEditorModule } from 'ngx-monaco-editor';

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
		MatAutocompleteModule,
		MatFormFieldModule,
		MatInputModule,
		MonacoEditorModule,
		FlexLayoutModule,
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
