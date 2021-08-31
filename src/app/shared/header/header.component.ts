import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit,AfterViewInit {

  constructor() { }
  ngAfterViewInit(): void {}
  

  @ViewChild('msgFocus') vc: any;


  showToolbox: boolean = false;

  toggleToolbox(){
    this.showToolbox= !this.showToolbox
  }

  showsearch: boolean = false;

  showToggleSearch(){
    this.showsearch = !this.showsearch ;
    if(this.showsearch){
      this.vc.nativeElement.focus();
    }else {
      this.vc.nativeElement.blur();
    }
  }


  ngOnInit(): void {
  }

}
