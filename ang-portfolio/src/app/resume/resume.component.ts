import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DatamanagerService} from "../datamanager.service";

@Component({
  selector: 'resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})

export class ResumeComponent implements OnInit {


  constructor(private _http: DatamanagerService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      // this.movie_id = params['movie_id'];
      // console.log(`got the id: `, this.movie_id);
    });
  }

  ngOnInit() {
    console.log(`loading resume...`,);

  }

}
