import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './controls/home/home.component';
import { DocumentationComponent } from './controls/documentation/documentation.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'documentation', component: DocumentationComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [
      RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
