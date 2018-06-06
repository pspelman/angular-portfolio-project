import { Component, OnInit } from '@angular/core';
import {DatamanagerService} from "../datamanager.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {


  constructor(private _http: DatamanagerService, private router: Router, private activatedRoute: ActivatedRoute) {

  }


  ngOnInit() {
  }

}
