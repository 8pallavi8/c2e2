import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-hvac',
  templateUrl: './hvac.component.html',
  styleUrls: ['./hvac.component.scss']
})
export class HvacComponent implements OnInit {
  selectedValue: string;
  formgroup: FormGroup;


  constructor(private fb: FormBuilder) { }

  

  clients = [{ value: 'Yes' }, { value: 'No' }, { value: 'N/A' }];

  ngOnInit(): void {
    this.formgroup = this.fb.group({
      heatefficiency: ['', Validators.compose([Validators.required])],
      airconditioning: ['', Validators.compose([Validators.required])],
      ventilation: ['', Validators.compose([Validators.required])],
      infiltration: ['', Validators.compose([Validators.required])],
      economizer: ['', Validators.compose([Validators.required])],
      miscellaneousdata: ['', Validators.compose([Validators.required])]
    }
    )
  }
}
