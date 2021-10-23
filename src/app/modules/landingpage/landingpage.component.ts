import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {

  row1: number;
  row2: number
  constructor() { }

  ngOnInit() {
    this.row1 = (window.innerWidth <= 600) ? 2 : 4;
    this.row2 = (window.innerWidth <= 600) ? 2 : 3;
  }
  
  onResize(event) {
   var windowWidth: number; 
    switch(windowWidth){
       case 2560 : 
    }
    this.row1 = (window.innerWidth <= 600) ? 2 : 4;
    this.row2 = (window.innerWidth <= 600) ? 2 : 3;
  }

}
