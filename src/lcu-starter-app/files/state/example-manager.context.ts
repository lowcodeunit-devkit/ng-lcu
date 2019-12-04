import { Injectable, Injector } from '@angular/core';
import { StateManagerContext } from '@lcu/common';
import { ExampleModel } from '../models/example.model';

@Injectable({
    providedIn: 'root'
})
export class ExampleManagerContext extends StateManagerContext<ExampleModel> {

    protected state: ExampleModel;

    constructor(protected injector: Injector) {
        super(injector);
    }

    public GetExampleById(id: number): void {
        this.state.Loading = true;

        this.Execute({
            Arguments: {
                ExampleId: id
            },
            Type: 'get-example-by-id'
        });
    }
}
