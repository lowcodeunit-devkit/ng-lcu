import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FathymSharedModule } from '@lcu/common';

@NgModule({
  declarations: [],
  imports: [
    FathymSharedModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  exports: [],
  entryComponents: []
})
export class <%= classify(name) %>Module { }