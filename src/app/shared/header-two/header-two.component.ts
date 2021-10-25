import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-two',
  templateUrl: './header-two.component.html',
  styleUrls: ['./header-two.component.scss']
})
export class HeaderTwoComponent implements OnInit {

  constructor(private router: Router) { }
  showSearch: boolean = false;
  showMenu: boolean = false;
  ngOnInit(): void {
  }

  naviagateToHome(){
     this.router.navigateByUrl('');
  }

}
