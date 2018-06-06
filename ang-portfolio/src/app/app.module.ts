import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RoutingModule } from './routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ResumeComponent } from './resume/resume.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProjectsComponent } from './projects/projects.component';
import {DatamanagerService} from "./datamanager.service";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ResumeComponent,
    NavbarComponent,
    ProjectsComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    HttpClientModule,
  ],
  providers: [DatamanagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
