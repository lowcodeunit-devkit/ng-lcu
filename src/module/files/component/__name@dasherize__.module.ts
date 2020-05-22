import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FathymSharedModule, MaterialModule } from '@lcu/common';
import { <%= classify(elementName) %>Service } from './services/<%= dasherize(elementName) %>.service';

@NgModule({
  declarations: [],
  imports: [
    FathymSharedModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule
  ],
  exports: [],
  entryComponents: []
})
export class <%= classify(name) %>Module {
  static forRoot(): ModuleWithProviders<<%= classify(name) %>Module> {
    return {
      ngModule: <%= classify(name) %>Module,
      providers: [<%= classify(elementName) %>Service]
    };
  }
}
