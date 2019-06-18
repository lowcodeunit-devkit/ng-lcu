import { TutorialModel } from '../models/tutorial.model';

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';


@Injectable({
  providedIn: 'root'
})

export class SharedNotificationService {

  public TutorialsDataUpdated = new Subject<Array<TutorialModel>>();

  constructor() { }

 /**
  * Update tutorials' data
  * 
  * @param params array of tutorials
  */
  public UpdateTutorialData(params: Array<TutorialModel>): void {
    console.log('shared notification service', params);
    this.TutorialsDataUpdated.next({ ...params });
  }
}
