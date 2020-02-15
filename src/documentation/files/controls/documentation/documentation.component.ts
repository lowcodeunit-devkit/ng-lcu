import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lcu-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent implements OnInit {

  public LocationRoot: string;

  constructor() {
    this.LocationRoot = '<%= path %>/';
  }

  public ngOnInit(): void { }

}
