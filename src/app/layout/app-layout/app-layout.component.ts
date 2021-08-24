import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-layout',
  templateUrl:'./app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnInit {

 
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
     
  }

}
