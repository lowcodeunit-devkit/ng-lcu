import { NgModule } from '@angular/core';
import { BaseSolutionModule } from '@lowcodeunit/solutions';
import { FathymSharedModule } from '@lowcodeunit/common';
import { Forge<%= classify(name) %>SolutionManage } from './manage/__name@dasherize__-manage.component';
import { Forge<%= classify(name) %>SolutionDocumentation } from './documentation/__name@dasherize__-documentation.component';
import { Forge<%= classify(name) %>SolutionHeading } from './heading/__name@dasherize__-heading.component';
import { Forge<%= classify(name) %>SolutionMarketplace } from './marketplace/__name@dasherize__-marketplace.component';
import { Forge<%= classify(name) %>SolutionOverview } from './overview/<%= dashify(name) %>-overview.component';


export class Forge<%= classify(name) %>SolutionDisplayModule extends BaseSolutionModule {
	public Documentation() {
		return Forge<%= classify(name) %>SolutionDocumentation;
	}

	public Heading() {
		return Forge<%= classify(name) %>SolutionHeading;
	}

	public Manage() {
		return Forge<%= classify(name) %>SolutionManage;
	}

	public Marketplace() {
		return Forge<%= classify(name) %>SolutionMarketplace;
	}

	public Overview() { 
		return Forge<%= classify(name) %>SolutionOverview;
	}
}

var comps = [
	Forge<%= classify(name) %>SolutionDocumentation,
	Forge<%= classify(name) %>SolutionHeading,
	Forge<%= classify(name) %>SolutionManage,
	Forge<%= classify(name) %>SolutionMarketplace,
	Forge<%= classify(name) %>SolutionOverview,
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
export class Forge<%= classify(name) %>SolutionModule { 
}
