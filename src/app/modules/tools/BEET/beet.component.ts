import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { BEETSummary } from 'src/app/shared/models/models';
import { ToolsService } from 'src/app/shared/services/tools.service';
import { GendetailsComponent } from './gendetails/gendetails.component';


export interface summary {
  Parameter: string;
  Units: string;
  Value: string;
  
}


@Component({
  selector: 'app-beet',
  templateUrl: './beet.component.html',
  styleUrls: ['./beet.component.scss']
})
export class BEETComponent implements OnInit, AfterViewInit {
  inputTableDataSource:any;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  sixthFormGroup: FormGroup;
  @ViewChild(GendetailsComponent) primaryComponent: GendetailsComponent;
  displayedColumns:string[]= ["Parameter","Units","Value"];
  summaryTable:summary[];
  dataSource:any;

  constructor(private _formBuilder: FormBuilder, private toolService: ToolsService,private fb: FormBuilder,private cd: ChangeDetectorRef) { }




  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.fourthFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.fifthFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.sixthFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
    console.log('Values on ngAfterViewInit():');
    console.log("UserName:", this.primaryComponent.formGroup.controls.UserName.value);
  }
  selectionStepperChange(event){
      if(event.selectedIndex== 6){
        this.showSummary();
      }
  } 
  showSummary() {
    console.log("UserName:", this.primaryComponent.formGroup.controls.UserName.value);
    this.summaryTable = [
      { Parameter: 'Assessment name', Units: null, Value: this.primaryComponent.formGroup.controls.UserName.value },
      { Parameter: 'Assessment name', Units: null, Value: this.primaryComponent.formGroup.controls.ProjectName.value},
      { Parameter: 'Country', Units: null, Value: this.primaryComponent.formGroup.controls.Country.value },
      { Parameter: 'Province', Units: null, Value: this.primaryComponent.formGroup.controls.Province.value},
      { Parameter: 'Location', Units: null, Value: this.primaryComponent.formGroup.controls.Location.value},
      { Parameter: 'Building type', Units: null, Value: this.primaryComponent.formGroup.controls.Buildingtype.value },
      { Parameter: 'Building age', Units: 'Years', Value: this.primaryComponent.formGroup.controls.Yearofconstruction.value},
      { Parameter: 'Building gross area', Units: this.primaryComponent.formGroup.controls.grossAreaUnits.value, Value: this.primaryComponent.formGroup.controls.Buildinggrossarea.value },
      { Parameter: 'Building net occupiable area', Units: this.primaryComponent.formGroup.controls.netunits.value, Value: this.primaryComponent.formGroup.controls.Netoccupiedfloorarea.value},
      { Parameter: 'No. of floors', Units: 'number', Value: this.primaryComponent.formGroup.controls.Nooffloors.value},
      { Parameter: 'Occupancy hours per week', Units: 'hours per week', Value: this.primaryComponent.formGroup.controls.Occupanyhoursperweek.value},
      { Parameter: 'Occupant density', Units: 'square meter per person', Value: this.primaryComponent.formGroup.controls.occupancyValue.value},
      { Parameter: 'Electricty cost', Units: this.primaryComponent.formGroup.controls.units.value, Value: this.primaryComponent.formGroup.controls.Electricitycost.value},
      { Parameter: 'Fuel cost', Units: this.primaryComponent.formGroup.controls.fuelunits.value, Value: this.primaryComponent.formGroup.controls.Fuelcost.value}
    ];
    this.dataSource = new MatTableDataSource(this.summaryTable);
  } 

}