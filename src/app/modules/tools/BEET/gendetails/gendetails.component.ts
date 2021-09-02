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

  constructor(private fb: FormBuilder, private toolService: ToolsService) { }

  ngOnInit(): void {
    this.formGroup = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      UserName: ['kkk', Validators.compose([Validators.required])],
      ProjectName: ['lll', Validators.compose([Validators.required])],
      Country: ['Argentina', Validators.compose([Validators.required])],
      Province: ['wer', Validators.compose([Validators.required])],
      Location: ['werty', Validators.compose([Validators.required])],
    });
  }

}