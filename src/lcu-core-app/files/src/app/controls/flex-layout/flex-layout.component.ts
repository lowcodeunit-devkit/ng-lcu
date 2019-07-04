import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lcu-flex-layout',
  templateUrl: './flex-layout.component.html',
  styleUrls: ['./flex-layout.component.scss']
})
export class FlexLayoutComponent implements OnInit {

  /**
   * Title
   */
  public PageTitle: string;

  /**
   * Subtitle
   */
  public SubTitle: string;
  public SubTitleTwo: string;

  /**
   * Title
   */
  public Title: string;
  public TitleTwo: string;

  /**
   * Title Icon
   */
  public TitleIcon: string;
  public TitleIconTwo: string;

  constructor() {
    this.PageTitle = 'Angular Flex Layout';
    this.Title = 'Responsive API';
    this.SubTitle = 'How to use Space';
    this.TitleIcon = 'view_quilt';

    this.TitleTwo = 'Responsive API';
    this.SubTitleTwo = 'Holy Grail Layout';
    this.TitleIconTwo = 'view_carousel';
  }

  ngOnInit() {
  }

}
