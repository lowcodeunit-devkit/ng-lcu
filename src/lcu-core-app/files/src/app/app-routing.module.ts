import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './controls/home/home.component';
import { FlexLayoutComponent } from './controls/flex-layout/flex-layout.component';
import { ReactiveFormComponent } from './controls/reactive-form/reactive-form.component';
import { TutorialsComponent } from './controls/tutorials/tutorials.component';
import { UserComponent } from './controls/user/user.component';
import { PageNotFoundComponent } from './controls/page-not-found/page-not-found.component';


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
