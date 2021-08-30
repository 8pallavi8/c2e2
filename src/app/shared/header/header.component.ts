import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor() { }


  showToolbox: boolean = false;

  toggleToolbox(){
    console.log(this.showToolbox)
    this.showToolbox= !this.showToolbox
    console.log(this.showToolbox)

  }

  ngOnInit(): void {
  }

}
