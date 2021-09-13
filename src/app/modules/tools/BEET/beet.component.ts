import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BEETSummary } from 'src/app/shared/models/models';
import { ToolsService } from 'src/app/shared/services/tools.service';
import { GendetailsComponent } from './gendetails/gendetails.component';

@Component({
  selector: 'app-beet',
  templateUrl: './beet.component.html',
  styleUrls: ['./beet.component.scss']
})
export class BEETComponent implements OnInit, AfterViewInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  sixthFormGroup: FormGroup;
  @ViewChild(GendetailsComponent) primarySampleComponent: GendetailsComponent;

  constructor(private _formBuilder: FormBuilder, private toolService: ToolsService) { }
  //beetSummary : BEETSummary;

  ngAfterViewInit() {
    console.log('Values on ngAfterViewInit():');
    console.log("UserName:", this.primarySampleComponent.formGroup.controls.UserName.value);
  }

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

    //this.beetSummary = this.toolService.beetsummary
  }
  showSummary() {
    console.log("UserName:", this.primarySampleComponent.formGroup.controls.UserName.value);
  }

}