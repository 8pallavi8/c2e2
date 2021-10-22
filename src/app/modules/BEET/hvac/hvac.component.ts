import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime } from 'rxjs/operators';
import { beetService } from 'src/app/shared/services/beet.service';
import { ConfirmationDialogService } from 'src/app/shared/services/confirmation-dialog.service';
import { InputdialogService } from 'src/app/shared/services/inputdialog.service';


export interface HeatingEquip {
  heatingequipmentname: string;
  imgpath: string;
}

export interface CoolingEquip {
  coolingequipmentname: string;
  imgpath: string;
}


@Component({
  selector: 'app-hvac',
  templateUrl: './hvac.component.html',
  styleUrls: ['./hvac.component.scss']
})
export class HvacComponent implements OnInit {
  selectedValue: string;
  formgroup: FormGroup;
  units: string = "centigrade";
  hasInfiltrationRateValue: boolean = false;
  infiltration: number;
  ventilationvalue: number;
  selCountryCode: string;
  selBuildingCode:string;
  selBuildingSpaces:string[];
  heatingData: HeatingEquip;
  coolingData: CoolingEquip;
  defaultInfiltrationRate:number;


  constructor(private fb: FormBuilder, public dialog: MatDialog,
    private confirmationDialog: ConfirmationDialogService,
    private inputDialog: InputdialogService,
    private beetService: beetService) { }

  options = [{ value: 'Yes' }, { value: 'No' }, { value: 'N/A' }];

  ngOnInit(): void {
    this.formgroup = this.fb.group({
      heatefficiency: ['', Validators.compose([Validators.required])],
      heatefficiencyKnown: ['', Validators.compose([Validators.required])],
      heatValueImages: ['', Validators.compose([Validators.required])],
      coolImages: ['', Validators.compose([Validators.required])],
      airconditioning: ['', Validators.compose([Validators.required])],
      aircoolingopta: ['', Validators.compose([Validators.required])],
      aircoolingoptb: ['', Validators.compose([Validators.required])],
      aircoolingoptc: ['', Validators.compose([Validators.required])],
      ventilation: ['0', Validators.compose([Validators.required])],
      ventilationKnown: ['0', Validators.compose([Validators.required])],
      ventilationUnits: ['', Validators.compose([Validators.required])],
      infiltration: [0, Validators.compose([Validators.required])],
      infiltrationknown: ['', Validators.compose([Validators.required])],
      economizer: ['', Validators.compose([Validators.required])],
      avgIndoorAirTemp: ['', Validators.compose([Validators.required])],
      HvacCompressorInstalled: ['', Validators.compose([Validators.required])],
      HvacFansandBlowersInstalled: ['', Validators.compose([Validators.required])]
    }
    )
    /* this.formgroup.get('infiltration').valueChanges.pipe(debounceTime(1000)).subscribe((changes) => {
      this.infiltration = changes;
      console.log(changes);
    }); */
    this.beetService.getSelectedCountry().subscribe(res => { this.selCountryCode = res; console.log(this.selCountryCode); });
    this.beetService.getSelectedbuildingType().subscribe(res => { this.selBuildingCode = res;});
    this.beetService.getSelectedbuildingSpaces().subscribe(res => { this.selBuildingSpaces = res;});

    this.beetService.getGeneralDetails().subscribe(res => {
      this.heatingData = res.success.heatingequipment;
      this.coolingData = res.success.coolingequipment;
      this.defaultInfiltrationRate=res.success.defaultinfiltration;

    });

  }

  public openConfirmationDialog() {
    this.confirmationDialog.confirm('Confirm', 'You have selected No Heating Equipment In The Building', 'OK', null)
      .catch(() => console.log('User dismissed the dialog'));
  }


  public openConfirmationDialogac() {
    this.confirmationDialog.confirm('Confirm', 'You have selected No Cooling Equipment In The Building', 'OK', null)
      .catch(() => console.log('User dismissed the dialog'));
  }

  processHeatCoolEvent(event, type) {
    this.postCalculateEquipEfficiency(type,event.value );
    console.log("heat"+event)
  }


  postCalculateEquipEfficiency(type, equipname): void {
    var payload: any = {
      "countrycode": this.selCountryCode,
      "equipmenttype": type,
      "equipmentname": equipname
    }
    console.log(payload);
    this.beetService.postCalculateEquipEfficiency(payload).subscribe(res => {
      console.log(res.success);
    })
  }


  postCalculateVentilationRate(): void {
    var payload: any = {
      "countrycode": this.selCountryCode,
      "buildingtype": this.selBuildingCode,
      "buildingspaces": this.selBuildingSpaces
    }
    console.log(payload);
    this.beetService.postCalculateVentilationRate(payload).subscribe(res => {
      console.log(res.success);
    })
  }

  defaultInfiltration(){
    this.formgroup.controls['infiltration'].setValue(this.defaultInfiltrationRate);
    console.log(this.formgroup.controls.infiltration.value)
  }

}
