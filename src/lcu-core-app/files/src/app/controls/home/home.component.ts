import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'lcu-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  /**
   * Input property for background image
   */
  // tslint:disable-next-line:no-input-rename
  @Input('background-image')
  public BackgroundImage: string;

  constructor() { }

  ngOnInit() {
  }

}
