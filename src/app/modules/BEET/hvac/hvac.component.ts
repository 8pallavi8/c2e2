import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
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
  selBuildingCode: string;
  selBuildingSpaces: string[];
  heatingData: HeatingEquip;
  coolingData: CoolingEquip;
  defaultInfiltrationRate: number;
  heatingImageEffValue: Number;
  coolingImageEffValue: Number;


  constructor(private fb: FormBuilder, public dialog: MatDialog,
    private confirmationDialog: ConfirmationDialogService,
    private inputDialog: InputdialogService,
    private beetService: beetService) { }

  options = [{ value: 'Yes' }, { value: 'No' }, { value: 'N/A' }];

  ngOnInit(): void {
    this.formgroup = this.fb.group({
      heatefficiency: ['', Validators.compose([Validators.required])],
      heatefficiencyArray: this.fb.array([]),
      coolefficiencyArray: this.fb.array([]),
      airconditioning: ['', Validators.compose([Validators.required])],
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

    this.beetService.getSelectedCountry().subscribe(res => { this.selCountryCode = res; console.log(this.selCountryCode); });
    this.beetService.getSelectedbuildingType().subscribe(res => { this.selBuildingCode = res; });
    this.beetService.getSelectedbuildingSpaces().subscribe(res => { this.selBuildingSpaces = res; });

    this.beetService.getGeneralDetails().subscribe(res => {
      this.heatingData = res.success.heatingequipment;
      this.coolingData = res.success.coolingequipment;
      this.defaultInfiltrationRate = res.success.defaultinfiltration;

    });

  }


  onChangecoolingEffOption(event: MatRadioChange) {
    console.log(this.formgroup.get('coolefficiencyArray'));
    (<FormArray>this.formgroup.get('coolefficiencyArray')).removeAt(0);

    if (event.value == 1) {
      (<FormArray>this.formgroup.get('coolefficiencyArray')).push(this.fb.group({
        aircoolingopta: ['', Validators.required],
        aircoolingoptb: ['', Validators.required],
        aircoolingoptc: ['', Validators.required]
      }));
    } else if (event.value == 2) {
      (<FormArray>this.formgroup.get('coolefficiencyArray')).push(this.fb.group({
        heatValueImages: ['', Validators.required],
      }));
    }
    else if (event.value == 3) {
      this.openConfirmationDialog()
    }
  }

  onChangeHeatEffOption(event: MatRadioChange) {
    console.log(this.formgroup.get('heatefficiencyArray'));
    (<FormArray>this.formgroup.get('heatefficiencyArray')).removeAt(0);

    if (event.value == 1) {
      (<FormArray>this.formgroup.get('heatefficiencyArray')).push(this.fb.group({
        heatefficiencyKnown: ['', Validators.required]
      }));
    } else if (event.value == 2) {
      (<FormArray>this.formgroup.get('heatefficiencyArray')).push(this.fb.group({
        coolImages: ['', Validators.required],
      }));
    }

    else if (event.value == 3) {
      this.openConfirmationDialog()
    }
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
    this.postCalculateEquipEfficiency(type, event.value);
    console.log("heat" + event)
  }


  postCalculateEquipEfficiency(type, equipname): void {
    var payload: any = {
      "countrycode": this.selCountryCode,
      "equipmenttype": type,
      "equipmentname": equipname
    }
    console.log(payload);
    this.beetService.postCalculateEquipEfficiency(payload).subscribe(res => {
      if (type == 'heating') {
        this.heatingImageEffValue = res.success.efficiency

      } else {
        this.coolingImageEffValue = res.success.efficiency
      }

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

  defaultInfiltration() {
    this.formgroup.controls['infiltration'].setValue(this.defaultInfiltrationRate);
    console.log(this.formgroup.controls.infiltration.value)
  }

}
