import { Directive, OnInit } from '@angular/core';

@Directive({
  selector: '[example]'
})
export class ExampleDirective implements OnInit {

  constructor() { }

  ngOnInit() { }

}