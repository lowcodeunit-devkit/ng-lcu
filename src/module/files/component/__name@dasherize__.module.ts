import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FathymSharedModule } from '@lcu/common';
import { ExampleComponent } from './controls/example/example.component';

@NgModule({
  declarations: [ExampleComponent],
  imports: [
    FathymSharedModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  exports: [ExampleComponent],
  entryComponents: []
})
export class <%= classify(name) %>Module {}
