import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {AppComponent} from "./app.component";
import {ResumeComponent} from "./resume/resume.component";

const routes: Routes = [
  {path:'resume', component: ResumeComponent},
  {path: 'home', component: HomeComponent},
  {path: '', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
