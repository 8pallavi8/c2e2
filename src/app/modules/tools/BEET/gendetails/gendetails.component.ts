import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { ToolsService } from 'src/app/shared/services/tools.service';

@Component({
  selector: 'app-gendetails',
  templateUrl: './gendetails.component.html',
  styleUrls: ['./gendetails.component.scss']
})
export class GendetailsComponent implements OnInit {

  formGroup: FormGroup;
  inputTableDataSource: any;
  inputDisplayedColumns: string[] = [
    'option',
    'select'
  ]

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formGroup = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      UserName: ['', Validators.compose([Validators.required])],
      ProjectName: ['', Validators.compose([Validators.required])],
      Country: ['', Validators.compose([Validators.required])],
      Province: ['', Validators.compose([Validators.required])],
      Location: ['', Validators.compose([Validators.required])],
      Buildingtype: ['', Validators.compose([Validators.required])],
      Categories: ['', Validators.compose([Validators.required])],
      Yearofconstruction:['', Validators.compose([Validators.required])],
      Buildinggrossarea:['', Validators.compose([Validators.required])],
      Netoccupiedfloorarea: ['', Validators.compose([Validators.required])],
      Nooffloors:['', Validators.compose([Validators.required])],
      Occupanyhoursperweek:['', Validators.compose([Validators.required])],
      Occupancypeople: new FormControl('',Validators.required),
      Electricitycost:['', Validators.compose([Validators.required])],
      Fuelcost:['', Validators.compose([Validators.required])]
    });
  }

}