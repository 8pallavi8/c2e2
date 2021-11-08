import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-textfieldsdialog',
  templateUrl: './textfieldsdialog.component.html',
  styleUrls: ['./textfieldsdialog.component.scss']
})

export class textfieldsdialogComponent implements OnInit {
  OuterWallAdvFG:FormGroup;

 
  constructor(private activeModal: NgbActiveModal,private fb: FormBuilder,private dialogRef: MatDialogRef<textfieldsdialogComponent>) { }

  ngOnInit(): void {
    this.OuterWallAdvFG=this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      thickness: [, Validators.compose([Validators.required])],
    });
  }

  public accept() {
    this.dialogRef.close(this.OuterWallAdvFG.controls.thickness.value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
