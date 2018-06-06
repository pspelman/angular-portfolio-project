import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    $(function () {
      // When the user scrolls the page, execute myFunction
      window.onscroll = function() {myFunction()};

      // Get the nav__topnav
      var nav__topnav = document.getElementById("nav__topnav");

      // Get the offset position of the nav__topnav
      var sticky = nav__topnav.offsetTop;
      console.log(`sticky: `,sticky);
      // Add the sticky class to the nav__topnav when you reach its scroll position. Remove "sticky" when you leave the scroll position
      function myFunction() {
        if (window.pageYOffset >= sticky) {
          nav__topnav.classList.add("sticky");
          console.log(`making sticky`,);
        } else {
          nav__topnav.classList.remove("sticky");
          console.log(`making un-sticky`,);
        }
      }
    });


  }

}
