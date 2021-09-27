import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

export interface example {
  Layer: number;
  Capadelelementoconstructivo: string;
  Espesordecadacapa: number;
  Resistenciatermica: number;
}

@Component({
  selector: 'app-outerwall-radvancedleveldialog',
  templateUrl: './outerwall-radvancedleveldialog.component.html',
  styleUrls: ['./outerwall-radvancedleveldialog.component.scss']
})


export class OuterwallRadvancedleveldialogComponent implements OnInit {

  layersList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  elementsList = ["Camara de aire", "Ladrillo comun-picture options", "Select more from list of materials"]
  displayedColumns: string[] = [
    'Layer',
    'Capadelelementoconstructivo',
    'Espesordecadacapa',
    'Resistenciatermica'
  ];
  ExampleTable: example[] = [
    { Layer: null, Capadelelementoconstructivo: 'Resistencia superficial exterior', Espesordecadacapa: null, Resistenciatermica: 0.04 },
    { Layer: 1, Capadelelementoconstructivo: 'Revoque', Espesordecadacapa: 0.015, Resistenciatermica: 0.013 },
    { Layer: 2, Capadelelementoconstructivo: 'Ladrillo comun	', Espesordecadacapa: 0.12, Resistenciatermica: 0.13 },
    { Layer: 3, Capadelelementoconstructivo: 'Camara de aire', Espesordecadacapa: 0.05, Resistenciatermica: 0.17 },
    { Layer: 4, Capadelelementoconstructivo: 'Ladrillo comun', Espesordecadacapa: 0.12, Resistenciatermica: 0.13 },
    { Layer: 5, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 6, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 7, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 8, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 9, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 10, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: null, Capadelelementoconstructivo: 'Resistencia superficial interior', Espesordecadacapa: null, Resistenciatermica: 0.13 },
    { Layer: null, Capadelelementoconstructivo: 'Total', Espesordecadacapa: 0.305, Resistenciatermica: 0.613 },
  ];
  dataSource = new MatTableDataSource(this.ExampleTable);

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

  onOptionsSelected(selectedvalue) {
    if (selectedvalue.value = "Camara de aire") {
      console.log(selectedvalue.value);
    }
    else if (selectedvalue.value = "Ladrillo comun-picture options") {
      console.log(selectedvalue.value);
    }
    else if (selectedvalue.value = "Select more from list of materials") {
      console.log(selectedvalue.value);
    }
  }

  



}
