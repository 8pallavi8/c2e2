import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-textfieldsdialog',
  templateUrl: './textfieldsdialog.component.html',
  styleUrls: ['./textfieldsdialog.component.scss']
})

export class textfieldsdialogComponent implements OnInit {

  @Input() title: string;
  @Input() text: string;
  @Input() notes: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;
  @Input() inputfield1text:string;
  @Input() inputfield2text:string;
  ventilationcubicmt:number;
  ventilationcubicft:number;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(this.ventilationcubicmt ? this.ventilationcubicmt  : this.ventilationcubicft);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }
  /* onNoClick(): void {
    this.dialogRef.close();
  }
  enteredPlugLoad() {
    this.dialogRef.close(this.ventilationcubicmt ? this.ventilationcubicmt  : this.ventilationcubicft);
  } */
}
