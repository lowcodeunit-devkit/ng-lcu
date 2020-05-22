import { Injectable, Injector } from '@angular/core';
import { StateContext } from '@lcu/common';
import { <%= classify(elementName) %>ManagementState } from './<%= dasherize(elementName) %>-management.state';

@Injectable({
    providedIn: 'root'
})
export class <%= classify(elementName) %>ManagementStateContext extends StateContext<<%= classify(elementName) %>ManagementState> {

    // Constructors
    constructor(protected injector: Injector) {
        super(injector);
    }

    
    // API Methods
    public Get<%= classify(elementName) %>ById(id: number): void {
        this.Execute({
            Arguments: {
                <%= classify(elementName) %>Id: id
            },
            Type: 'Get<%= classify(elementName) %>ById'
        });
    }

    //  Helpers
    protected defaultValue() {
        return { Loading: true } as <%= classify(elementName) %>ManagementState;
    }
    
    protected loadStateKey(): string {
        return 'main';
    }

    protected loadStateName(): string {
        return '<%= dasherize(elementName) %>';
    }
}
