import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ReactiveFormComponent } from '../../controls/reactive-form/reactive-form.component';


@Injectable({
    providedIn: 'root'
})

export class FormUnsavedChangesGuard implements CanDeactivate<ReactiveFormComponent> {
    canDeactivate(component: ReactiveFormComponent,
                  route: ActivatedRouteSnapshot,
                  state: RouterStateSnapshot) {

        console.log('ReactiveFormComponentGuard');
        console.log(route.params);
        console.log(state.url);
        return component.CanDeactivate() || window.confirm('There are unsaved changes; are you sure you want to leave?');
    }
}