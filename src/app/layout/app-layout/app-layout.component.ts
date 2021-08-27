import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/shared/services/confirmation-dialog.service';


@Component({
  selector: 'app-layout',
  templateUrl:'./app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnInit {

 
  constructor(private activatedRoute: ActivatedRoute, private confirmationDialog: ConfirmationDialogService,
    private router: Router) { }

  ngOnInit(): void {
    
  }

}
