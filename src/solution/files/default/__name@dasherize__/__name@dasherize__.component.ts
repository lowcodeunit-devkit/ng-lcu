import { Component, OnInit, Injector } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu/common';

export class <%= classify(workspace) %><%= classify(name) %>ElementState {}

export class <%= classify(workspace) %><%= classify(name) %>Context extends LCUElementContext<<%= classify(workspace) %><%= classify(name) %>ElementState> {}

export const Selector<%= classify(workspace) %><%= classify(name) %>Element = '<%= dasherize(workspace) %>-<%= dasherize(name) %>-element';

@Component({
  selector: Selector<%= classify(workspace) %><%= classify(name) %>Element,
  templateUrl: './<%= dasherize(name) %>.component.html',
  styleUrls: ['./<%= dasherize(name) %>.component.scss']
})
export class <%= classify(workspace) %><%= classify(name) %>ElementComponent extends LcuElementComponent<<%= classify(workspace) %><%= classify(name) %>Context> implements OnInit {
  //  Fields

  //  Properties

  //  Constructors
  constructor(protected injector: Injector) {
    super(injector);
  }

  //  Life Cycle
  public ngOnInit() {
    super.ngOnInit();
  }

  //  API Methods

  //  Helpers
}
