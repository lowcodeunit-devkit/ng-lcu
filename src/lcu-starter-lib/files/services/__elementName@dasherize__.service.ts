import { Injectable } from '@angular/core';
import { <%= classify(elementName) %>Model } from '../models/<%= dasherize(elementName) %>.model';

@Injectable({
  providedIn: 'root'
})
export class <%= classify(elementName) %>Service {

  constructor() { }

  public getCardData(): <%= classify(elementName) %>Model[] {
    return [
      {
        <%= classify(elementName) %>Id: 1,
        Content: `A coding standard makes sure that all the developers working on the project are following certain specified guidelines.
                  The code can be easily understood and a proper consistency is maintained. Consistency has a positive impact on the
                  quality of the program and one should maintain it while coding. Also, it should be taken care that the guidelines are
                  homogeneously followed across different levels of the system and they do not contradict each other. The finished program
                  code should look like that it has been written by a single developer, in a single session.`,
        Title: 'Angular Style Guide',
        Subtitle: 'Best Practices for Developers to Follow',
        Icon: 'done_all',
        Url: 'https://fathym.visualstudio.com/Documentation/_wiki/wikis/Documentation.wiki/35/Style-Guide-Angular'
      },
      {
        <%= classify(elementName) %>Id: 2,
        Content: `A style guide helps to ensure a continuous brand experience. It means that no matter how, when or where a customer
                  experiences a brand, they are experiencing the same underlying traits. It’s this consistency across every touch-point
                  that helps build a brand and brand loyalty. And with 2.4 billion Internet users around the world (and growing), it’s
                  really more critical than ever for businesses to establish a comprehensive style guide.`,
        Title: 'Fathym UI/UX Style Guide',
        Subtitle: `Follow Some of Fathym's Favorite Designs`,
        Icon: 'palette',
        Url: 'https://fathym.visualstudio.com/Documentation/_wiki/wikis/Documentation.wiki/37/Style-Guide-Design'
      },
      {
        <%= classify(elementName) %>Id: 3,
        Content: `Fathym’s low-code framework is designed to give developers the freedom and best practice workflows to rapidly create
                  IoT and data-driven applications that are agnostic to tools, platforms and clouds. Each element of the framework is
                  built from Low-Code Units (LCUs) – modular building blocks of code that can be as large as an application, or as
                  small as a data visualization.`,
        Title: `Fathym's Low-Code Framework`,
        Subtitle: `Find More Information About Fathym's IoT Solutions`,
        Icon: 'code',
        Url: 'https://fathym.com/low-code-framework/'
      }
    ];
  }
  
}
