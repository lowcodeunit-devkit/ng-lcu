import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  HomeComponent,
  FlexLayoutComponent,
  ReactiveFormComponent,
  PageNotFoundComponent,
  TutorialsComponent,
  UserComponent} from '@fathym-it/hello-world-common';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent},
  { path: 'home/:param', component: HomeComponent},
  { path: 'fxLayout', component: FlexLayoutComponent, children: [
    { path: ':param', component: FlexLayoutComponent}
  ]},
  { path: 'reactiveForm', component: ReactiveFormComponent, children: [
    { path: ':param', component: ReactiveFormComponent}
  ]},
  { path: 'tutorials', component: TutorialsComponent},
  { path: 'user', component: UserComponent, children: [
    { path: ':id/:name/:role', component: UserComponent},
  ]},
  { path: '**', component: PageNotFoundComponent }
  // { path: 'map/:Params', component: AmblOnMapComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
