import { NgModule } from '@angular/core';
import { <%= classify(name) %>Component } from './<%= dasherize(name) %>.component';

@NgModule({
    declarations: [
        <%= classify(name) %>Component
    ],
    imports: [
    ],
    exports: [
        <%= classify(name) %>Component
    ]
})
export class <%= classify(name) %>Module {

}