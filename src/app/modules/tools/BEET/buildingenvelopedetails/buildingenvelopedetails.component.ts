import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-buildingenvelopedetails',
  templateUrl: './buildingenvelopedetails.component.html',
  styleUrls: ['./buildingenvelopedetails.component.scss']
})
export class BuildingenvelopedetailsComponent implements OnInit {
  formgroup: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formgroup = this.fb.group({
      outerwallr: ['', Validators.compose([Validators.required])],
      roofr: ['', Validators.compose([Validators.required])],
      windowr: ['', Validators.compose([Validators.required])],
      shgcwindow: ['', Validators.compose([Validators.required])],
      wwr: ['', Validators.compose([Validators.required])]
})
  }

}
