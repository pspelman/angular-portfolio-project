import { Component } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  main_page_title = 'My PortFoLiO';


  public ngOnInit() {
    $(function () {
      // alert('ready');
    });

  }
}
