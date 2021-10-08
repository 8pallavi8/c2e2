import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-rvalue-imagedialog',
  templateUrl: './rvalue-imagedialog.component.html',
  styleUrls: ['./rvalue-imagedialog.component.scss']
})
export class RvalueImagedialogComponent implements OnInit {

  rimage:string[]=["http://localhost:4200/assets/images/rvalue.png","http://localhost:4200/assets/images/rvalue.png"]


  constructor(public dialogRef:MatDialogRef<RvalueImagedialogComponent>) { }

  ngOnInit(): void {
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

}
