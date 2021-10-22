import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {

  breakpoint: number;
  constructor() { }

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 400) ? 2 : 6;
  }
  
  onResize(event) {
   var windowWidth: number; 
    switch(windowWidth){
       case 2560 : 
    }
    this.breakpoint = (event.target.innerWidth <= 400) ? 2 : 6;
  }

}
