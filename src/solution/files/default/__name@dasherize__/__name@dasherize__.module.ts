import { NgModule } from '@angular/core';
import { BaseSolutionModule } from '@lcu/solutions';
import { FathymSharedModule } from '@lcu/common';
import { Forge<%= classify(name) %>SolutionManage } from './manage/<%= dasherize(name) %>-manage.component';
import { Forge<%= classify(name) %>SolutionDocumentation } from './documentation/<%= dasherize(name) %>-documentation.component';
import { Forge<%= classify(name) %>SolutionHeading } from './heading/<%= dasherize(name) %>-heading.component';
import { Forge<%= classify(name) %>SolutionMarketplace } from './marketplace/<%= dasherize(name) %>-marketplace.component';
import { Forge<%= classify(name) %>SolutionOverview } from './overview/<%= dasherize(name) %>-overview.component';


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
