import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { textfieldsdialogComponent } from '../textfieldsdialog/textfieldsdialog.component';

@Injectable({
  providedIn: 'root'
})
export class InputdialogService {

  constructor(private modalService: NgbModal) { }
  public entervalue(
    title: string,
    text: string,
    notes: string,
    btnOkText: string,
    btnCancelText:string,
    inputfield1text:string,
    inputfield2text:string,
    dialogSize: 'sm'|'lg' = 'lg'): Promise<any> {
    const modalRef = this.modalService.open(textfieldsdialogComponent, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.text = text;
    modalRef.componentInstance.notes = notes;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    modalRef.componentInstance.inputfield1text = inputfield1text;
    modalRef.componentInstance.inputfield2text = inputfield2text;
   
    return modalRef.result;
  }



}
