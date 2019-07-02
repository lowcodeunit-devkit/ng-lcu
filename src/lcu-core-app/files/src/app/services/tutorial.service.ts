import { Injectable } from '@angular/core';
import { TutorialModel } from '../models/tutorial.model';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';

const tutorials: Array<TutorialModel> = [
    {
        Id: 1,
        Label: 'Angular Material',
        Url: 'https://material.angular.io/',
        Target: '_blank'
    },
    {
        Id: 2,
        Label: 'Angular Official Documentation',
        Url: 'https://angular.io/',
        Target: '_blank',
    },
    {
        Id: 3,
        Label: 'Angular Best Practices (Fathym Wiki)',
        Url: 'https://fathym.visualstudio.com/Documentation/_wiki/wikis/Documentation.wiki?wikiVersion=GBwikiMaster&pageId=33&pagePath=%2FFathym%20Documentation%20and%20Wiki',
        Target: '_blank',
    },
    {
        Id: 4,
        Label: 'Angular fxLayout Examples',
        Url: 'https://tburleson-layouts-demos.firebaseapp.com/#/docs',
        Target: '_blank'
    }
];

export class TutorialService {
    @Injectable({
        providedIn: 'root'
    })

    protected tutorials: Array<TutorialModel>;

    /**
     * Get tutorials
     */
    public GetTutorials(): Observable<Array<TutorialModel>> {

        return of(tutorials);
    }
}