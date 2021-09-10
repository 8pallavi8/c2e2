import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

export interface OPTIONS {
  operations: string;
  options: string;
  quantity: number;
}

@Component({
  selector: 'app-plugloads',
  templateUrl: './plugloads.component.html',
  styleUrls: ['./plugloads.component.scss']
})

export class PlugloadsComponent implements OnInit {
  formgroup: FormGroup;
  displayedColumns=['operations','options','quantity'];
  selectionOptions=['Yes','No','NA'];

  OPTIONS_DATA: OPTIONS[] = [
    {operations: 'Do you remove underused refrigerators ?', options: '', quantity:0},
    {operations: 'Do you replace inefficient refrigerators with most efficient one regularly ?', options: '', quantity: 0},
    {operations: 'Do you have shared full sized refrigerators instead of personal mini refrigerators ?', options: '', quantity:0},
    {operations: 'Do you have glass front refrigerators?', options: '', quantity:0},
    {operations: 'Do you upgrade your coffee machines, toasters, microwaves and other similar loads based on its operating condition status indicated on its screen or LED indicators?', options: '', quantity:0},
    {operations: 'Do you have timers to power down your plug loads during non-businees hours ?', options: '', quantity: 0},
    {operations: 'Do you remove underused vending machines ?', options: '', quantity:0},
    {operations: 'Do you remove aged and inefficient vending machines ?', options: '', quantity:0},
    {operations: 'Do you have load management devices ?', options: '', quantity:0},
    {operations: 'Do you remove or disconnect coolers from water coolers and drinking fountains when cooling is not required (for eg. Seasonal)', options: '', quantity: 0},
    {operations: 'Did you replace old standard desktop computers with efficient mini desktops and laptop computers ?', options: '', quantity:0},
    {operations: 'Do you disable screensavers and enable computer power management settings to attain standby mode after 15 minutes of inactivity or idle time ?', options: '', quantity:0},
    {operations: 'Do you have CRT monitors for your computers (not LED backlit LCD monitors)', options: '', quantity:0},
    {operations: 'Do you have fluorescent backlit LCD monitors for your computers (not LED backlit LCD monitors)', options: '', quantity: 0},
    {operations: 'Do you have shared multifunction devices (not multiple personal devices such as computer systems, phones, printers etc.)', options: '', quantity:0},
    {operations: 'Do you have any standard phones (not the latest VoIP phones) ?', options: '', quantity:0},
    {operations: 'Do you have incandescent type task lighting or desk lighting ?', options: '', quantity:0},
    {operations: 'Do you disable screensavers and enable computer power management settings for these shared multifunction devices to attain standby mode after 15 minutes of inactivity or idle time?', options: '', quantity:0},
    {operations: 'Do you control elevator lighting and ventilation with occupancy sensors?', options: '', quantity:0},

  ];


  dataSource= new MatTableDataSource(this.OPTIONS_DATA);


  constructor(private fb: FormBuilder) { }


  ngOnInit(): void {
    this.formgroup = this.fb.group({
      plugloads: ['', Validators.compose([Validators.required])],
      powergeneration: ['', Validators.compose([Validators.required])],
      onsiteco2emmisions: ['', Validators.compose([Validators.required])]
    }
    )
  }
 

}