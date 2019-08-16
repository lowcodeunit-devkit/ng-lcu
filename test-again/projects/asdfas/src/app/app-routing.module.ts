import { UserRoleAdminGuard } from './services/guards/user-role-admin.guard';
import { AlwaysAuthChildrenGuard } from './services/guards/always-auth-children.guard';
import { LoggedInGuard } from './services/guards/logged-in.guard';
import { AlwaysAuthGuard } from './services/guards/always-auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './controls/home/home.component';
import { FlexLayoutComponent } from './controls/flex-layout/flex-layout.component';
import { ReactiveFormComponent } from './controls/reactive-form/reactive-form.component';
import { TutorialsComponent } from './controls/tutorials/tutorials.component';
import { UserComponent } from './controls/user/user.component';
import { PageNotFoundComponent } from './controls/page-not-found/page-not-found.component';
import { FormUnsavedChangesGuard } from './services/guards/form-unsaved-changes.guard';
import { LoginComponent } from './controls/login/login.component';
import { DashboardComponent } from './controls/dashboard/dashboard.component';
import { UserRoleGuard } from './services/guards/user-role.guard';
import { DashboardAdminComponent } from './controls/dashboard-admin/dashboard-admin.component';
import { DashboardNonAdminComponent } from './controls/dashboard-non-admin/dashboard-non-admin.component';
import { UserRoleNonAdminGuard } from './services/guards/user-role-non-admin.guard';
import { DashboardGuard } from './services/guards/dashboard.guard';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent},
  { path: 'home/:param', component: HomeComponent},
  { path: 'fxLayout', component: FlexLayoutComponent,
    canActivate: [LoggedInGuard, AlwaysAuthGuard],
    canActivateChild: [AlwaysAuthChildrenGuard],
    children: [
    { path: ':param', component: FlexLayoutComponent}
  ]},
  { path: 'reactiveForm', component: ReactiveFormComponent,
    canDeactivate: [FormUnsavedChangesGuard],
      children: [
        { path: ':param', component: ReactiveFormComponent}
    ]
  },
  { path: 'tutorials', component: TutorialsComponent},
  { path: 'user', component: UserComponent, children:
  [
    { path: ':id/:name/:role', component: UserComponent},
  ]},
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [LoggedInGuard, DashboardGuard],
    // canActivateChild: [UserRoleAdminGuard],
    // children: [
    //   { path: '', redirectTo: 'admin', pathMatch: 'full' },
    //   { path: 'admin', component: DashboardAdminComponent },
    //   { path: 'user', component: DashboardNonAdminComponent }
    // ]
  },
  {
    path: '**', component: PageNotFoundComponent
  }
  // { path: 'map/:Params', component: AmblOnMapComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
