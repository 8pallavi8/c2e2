import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    });
  }

}