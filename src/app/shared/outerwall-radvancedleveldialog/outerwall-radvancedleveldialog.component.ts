import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-outerwall-radvancedleveldialog',
  templateUrl: './outerwall-radvancedleveldialog.component.html',
  styleUrls: ['./outerwall-radvancedleveldialog.component.scss']
})


export class OuterwallRadvancedleveldialogComponent implements OnInit {
  categoryList:string[]=["ROCAS Y SUELOS NATURALES","HORMIGONES","MADERAS","MATERIALES AISLANTES","MATERIALES EN POLVO O EN GRANO","MORTEROS","PLASTICOS RIGIDOS EN PLANCHAS"];


  constructor(public dialogRef: MatDialogRef<OuterwallRadvancedleveldialogComponent>,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }


  createForm(): FormGroup {
    return this.fb.group({
      elements: ['', Validators.compose([Validators.required])],
      layers: ['', Validators.compose([Validators.required])]

    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

 

  



}
