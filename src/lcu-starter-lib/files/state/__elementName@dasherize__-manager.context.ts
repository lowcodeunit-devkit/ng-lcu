import { Injectable, Injector } from '@angular/core';
import { StateManagerContext } from '@lcu/common';
import { <%= classify(elementName) %>Model } from '../models/<%= dasherize(elementName) %>.model';

@Injectable({
    providedIn: 'root'
})
export class <%= classify(elementName) %>ManagerContext extends StateManagerContext<<%= classify(elementName) %>Model> {

    protected State: <%= classify(elementName) %>Model;

    constructor(protected injector: Injector) {
        super(injector);
    }

    public Get<%= classify(elementName) %>ById(id: number): void {
        this.State.Loading = true;

        this.Execute({
            Arguments: {
                <%= classify(elementName) %>Id: id
            },
            Type: 'get-<%= dasherize(elementName) %>-by-id'
        });
    }
    
    protected async loadStateKey() {
        return 'main';
    }

    protected async loadStateName() {
        return '<%= dasherize(elementName) %>';
    }
}
