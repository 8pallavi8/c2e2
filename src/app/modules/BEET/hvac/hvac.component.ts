import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime } from 'rxjs/operators';
import { beetService } from 'src/app/shared/services/beet.service';
import { ConfirmationDialogService } from 'src/app/shared/services/confirmation-dialog.service';
import { InputdialogService } from 'src/app/shared/services/inputdialog.service';

@Component({
  selector: 'app-hvac',
  templateUrl: './hvac.component.html',
  styleUrls: ['./hvac.component.scss']
})
export class HvacComponent implements OnInit {
selectedValue: string;
  formgroup: FormGroup;
  units:string = "centigrade";
  hasInfiltrationRateValue:boolean= false;
  infiltration:number;
  ventilationvalue:number;
  selCountryCode: string;
  constructor(private fb: FormBuilder,public dialog: MatDialog,
    private confirmationDialog: ConfirmationDialogService,
    private inputDialog: InputdialogService,
    private beetService: beetService) { }

  options = [{ value: 'Yes' }, { value: 'No' }, { value: 'N/A' }];

  ngOnInit(): void {
    this.formgroup = this.fb.group({
      heatefficiency: ['', Validators.compose([Validators.required])],
      airconditioning: ['', Validators.compose([Validators.required])],
      ventilation: ['0', Validators.compose([Validators.required])],
      ventilationKnown: ['0', Validators.compose([Validators.required])],
      ventilationUnits: ['', Validators.compose([Validators.required])],
      infiltration: ['', Validators.compose([Validators.required])],
      economizer: ['', Validators.compose([Validators.required])],
      avgIndoorAirTemp: ['', Validators.compose([Validators.required])],
      HvacCompressorInstalled: ['', Validators.compose([Validators.required])],
      HvacFansandBlowersInstalled: ['', Validators.compose([Validators.required])]
    }
    )
    this.formgroup.get('infiltration').valueChanges.pipe(debounceTime(1000)).subscribe((changes) => {
      this.infiltration = changes;
      console.log(changes);
    });
    this.beetService.getSelectedCountry().subscribe(res => { this.selCountryCode = res; console.log(this.selCountryCode); });
  }


  public openInputVentilationDialog(){
    this.inputDialog.entervalue('HVAC Ventilation',
     'I know the ventilation rate value for my building.',
     'You may choose to enter the values for any of the units mentioned below, Necessary units conversions will be made by the tool for respective calculations.',
     'OK',
     'cancel',
     'Ventilation rate in [cubic meter per minute per person]:',
     'Ventilation rate in  [cubic feet per minute per person]:')
     .then((confirmed) => {this.ventilationvalue=confirmed })
      .catch(() => console.log('User dismissed the dialog'));
  }


  public openConfirmationDialog() {
    this.confirmationDialog.confirm('Confirm', 'You have selected No Heating Equipment In The Building','OK',null)
      .catch(() => console.log('User dismissed the dialog'));
  }


  public openConfirmationDialogac() {
    this.confirmationDialog.confirm('Confirm', 'You have selected No Cooling Equipment In The Building','OK',null)
      .catch(() => console.log('User dismissed the dialog'));
  }

  showInfiltrationRateValue(state:boolean):void{
    if(state== true)
    { this.hasInfiltrationRateValue = true;
      this.infiltration =0;
    }
    else
  {
    this.hasInfiltrationRateValue = false;
     this.infiltration =2;
  } 
  }  
}
