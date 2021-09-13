import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { textboxinputs } from '../models/beet-models';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  textboxitems: string[];
  selectedValues: string[]
  constructor(public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: textboxinputs, 
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.textboxitems = this.data.textBoxData;
    this.selectedValues = [];
  }
  onChange(e, selected) {
    if (e.checked) {
      this.selectedValues.push(selected)
    }
  }
  onNoClick(): void {
    console.log(this.selectedValues);
    this.dialogRef.close(this.selectedValues);
  }

}
