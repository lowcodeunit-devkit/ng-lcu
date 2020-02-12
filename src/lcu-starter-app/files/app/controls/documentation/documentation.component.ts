import { Component, OnInit } from '@angular/core';
import { LcuMarkdownDocsConfig } from '@lowcodeunit/lcu-documentation-common';

@Component({
  selector: 'lcu-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent implements OnInit {

  public Config: LcuMarkdownDocsConfig;

  constructor() {
    this.Config = new LcuMarkdownDocsConfig(
      {
        DefaultDocPath: 'introduction.md',
        Docs: [
          {
            Children: [],
            Path: 'introduction.md',
            Title: 'Introduction'
          }
        ],
        LocationRoot: 'docs/'
      }
    );
  }

  public ngOnInit(): void {

  }

}
