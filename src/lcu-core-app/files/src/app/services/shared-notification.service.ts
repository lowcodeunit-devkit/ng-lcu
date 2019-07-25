import { TutorialModel } from './../models/tutorial.model';

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';


@Injectable({
  providedIn: 'root'
})

export class SharedNotificationService {

  public ThemeChanged = new Subject<string>();
  public TutorialsDataUpdated = new Subject<Array<TutorialModel>>();

  constructor() { }

  /**
   * Update tutorials' data
   *
   * @param params array of tutorials
   */
  public UpdateTutorialData(params: Array<TutorialModel>): void {
    this.TutorialsDataUpdated.next({ ...params });
  }

  /**
   * Change app theme
   *
   * @param param theme
   */
  public ChangeTheme(param: string): void {
    this.ThemeChanged.next(param);
  }
}
