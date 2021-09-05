import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-buildingenvelopedetails',
  templateUrl: './buildingenvelopedetails.component.html',
  styleUrls: ['./buildingenvelopedetails.component.scss']
})
export class BuildingenvelopedetailsComponent implements OnInit {

  formgroup1: FormGroup;


  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formgroup1 = new FormGroup({
      outerwallr: new FormControl('',Validators.required),
      roofr: new FormControl('',Validators.required),
      windowr: new FormControl('',Validators.required),
      shgcwindow: new FormControl('',Validators.required),
      wwr: new FormControl('',Validators.required)
})

  }

}
