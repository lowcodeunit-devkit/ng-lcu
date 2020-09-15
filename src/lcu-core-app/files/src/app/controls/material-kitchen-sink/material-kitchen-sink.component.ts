import { Component, OnInit, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ViewportRuler } from '@angular/cdk/overlay';
import { FocusMonitor } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar} from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { DataSource } from '@angular/cdk/table';

@Component({
  template: `
    <button mat-raised-button color="primary">Do the thing</button>
  `
})
export class KitchenSinkComponent {}

@Component({
  selector: 'lcu-material-kitchen-sink',
  templateUrl: './material-kitchen-sink.component.html',
  styleUrls: ['./material-kitchen-sink.component.scss']
})

export class MaterialKitchenSinkComponent implements OnInit {
 /** List of columns for the CDK and Material table. */
 tableColumns = ['userId'];

 /** Data source for the CDK and Material table. */
 tableDataSource = new TableDataSource();

 myControl = new FormControl();
 options: string[] = ['One', 'Two', 'Three'];

 constructor(
   protected snackBar: MatSnackBar,
   protected dialog: MatDialog,
   protected viewportRuler: ViewportRuler,
   protected focusMonitor: FocusMonitor,
   protected elementRef: ElementRef<HTMLElement>,
   protected bottomSheet: MatBottomSheet
 ) {
   focusMonitor.focusVia(elementRef, 'program');
   snackBar.open('Hello there', '', { duration: 3000 });

   // Do a sanity check on the viewport ruler.
   viewportRuler.getViewportRect();
   viewportRuler.getViewportSize();
   viewportRuler.getViewportScrollPosition();
 }

 ngOnInit() {}
 openDialog() {
   this.dialog.open(KitchenSinkComponent);
 }
 openBottomSheet() {
   this.bottomSheet.open(KitchenSinkComponent);
 }
}

export class TableDataSource extends DataSource<any> {
 connect(): Observable<any> {
   return of([{ userId: 1 }, { userId: 2 }]);
 }

 disconnect() {}
}
