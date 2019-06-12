import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FathymSharedModule, MaterialModule } from '@lcu-ide/common';
import { TutorialsComponent } from './controls/tutorials/tutorials.component';
import { ReactiveFormComponent } from './controls/reactive-form/reactive-form.component';
import { FlexLayoutComponent } from './controls/flex-layout/flex-layout.component';
import { HomeComponent } from './controls/home/home.component';
import { PageNotFoundComponent } from './controls/page-not-found/page-not-found.component';
import { NavigationComponent } from './controls/navigation/navigation.component';
import { SideNavComponent } from './controls/side-nav/side-nav.component';
import { UserComponent } from './controls/user/user.component';
import { UsersListComponent } from './controls/users-list/users-list.component';
import { NavListComponent } from './controls/nav-list/nav-list.component';
import { TutorialService } from './services/tutorial.service';

@NgModule({
  declarations: [
    AppComponent,
    TutorialsComponent,
    ReactiveFormComponent,
    FlexLayoutComponent,
    HomeComponent,
    PageNotFoundComponent,
    NavigationComponent,
    SideNavComponent,
    UserComponent,
    UsersListComponent,
    NavListComponent
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    FlexLayoutModule,
    FathymSharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [TutorialService],
  bootstrap: [AppComponent]
})
export class AppModule { }
