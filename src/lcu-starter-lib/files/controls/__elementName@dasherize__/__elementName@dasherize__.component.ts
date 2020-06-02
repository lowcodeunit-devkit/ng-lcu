import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { <%= classify(elementName) %>Model } from '../../models/<%= dasherize(elementName) %>.model';

@Component({
  selector: 'lcu-<%= dasherize(elementName) %>',
  templateUrl: './<%= dasherize(elementName) %>.component.html',
  styleUrls: ['./<%= dasherize(elementName) %>.component.scss']
})
export class <%= classify(elementName) %>Component implements OnInit {

  @Input() public card: <%= classify(elementName) %>Model;

  @Output() public cardSelected: EventEmitter<any>;

  constructor() {
    this.cardSelected = new EventEmitter<any>();
  }

  public ngOnInit(): void { }

  public SelectCard(url?: string): void {
    this.cardSelected.emit();

    if (url) {
      window.open(url);
    }
  }

}
