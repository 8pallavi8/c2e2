import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-lighting',
  templateUrl: './lighting.component.html',
  styleUrls: ['./lighting.component.scss']
})
export class LightingComponent implements OnInit {
  formgroup: FormGroup;

  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
    this.formgroup = new FormGroup({
      lightdetails: new FormControl('',Validators.required),
  })
}
}