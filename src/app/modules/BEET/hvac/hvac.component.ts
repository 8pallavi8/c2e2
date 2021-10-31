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
  coolingImageEffUnits:string;
  
  options = [{ value: 'Yes' }, { value: 'No' }, { value: 'N/A' }];
  acEfficiencyParameterList:string[]=['EER','COP','SPC'];

  constructor(private fb: FormBuilder, public dialog: MatDialog,
    private confirmationDialog: ConfirmationDialogService,
    private inputDialog: InputdialogService,
    private beetService: beetService) { }

 

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
      infiltrationUnits: ['Air changes per Hour', Validators.compose([Validators.required])],
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
        acEfficiencyValue:['', Validators.required],
        acEfficiencyParameter:['', Validators.required]
      }));
    } else if (event.value == 2) {
      (<FormArray>this.formgroup.get('coolefficiencyArray')).push(this.fb.group({
         coolImages: ['', Validators.required],
         acEfficiencyValue:['', Validators.required],
         acEfficiencyUnits:['', Validators.required]


      }));
    }
    else if (event.value == 3) {
      this.openConfirmationDialogac()
    }
  }

  onChangeHeatEffOption(event: MatRadioChange) {
    console.log(this.formgroup.get('heatefficiencyArray'));
    (<FormArray>this.formgroup.get('heatefficiencyArray')).removeAt(0);

    if (event.value == 1) {
      (<FormArray>this.formgroup.get('heatefficiencyArray')).push(this.fb.group({
        heatefficiencyKnown: ['', Validators.required],
        heatEfficiencyUnits:['', Validators.required]
      }));
    } else if (event.value == 2) {
      (<FormArray>this.formgroup.get('heatefficiencyArray')).push(this.fb.group({
        heatValueImages: ['', Validators.required],
        heatefficiency: ['', Validators.required],
        heatEfficiencyUnits:['', Validators.required]
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
        ( <FormGroup> (<FormArray>this.formgroup.get('heatefficiencyArray')).at(0)).controls.heatefficiency.patchValue(res.success.efficiency);
        ( <FormGroup> (<FormArray>this.formgroup.get('heatefficiencyArray')).at(0)).controls.heatEfficiencyUnits.patchValue(res.success.efficiencyunit);

        console.log(this.formgroup.get('heatefficiencyArray'));
      } else 
      if (type == 'cooling'){
        ( <FormGroup> (<FormArray>this.formgroup.get('coolefficiencyArray')).at(0)).controls.acEfficiencyValue.patchValue(res.success.efficiency);
        ( <FormGroup> (<FormArray>this.formgroup.get('coolefficiencyArray')).at(0)).controls.acEfficiencyUnits.patchValue(res.success.efficiencyunit);
      }
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
      this.formgroup.controls.ventilationKnown.patchValue(res.success.ventilationrate);
      this.formgroup.controls.ventilationUnits.patchValue(res.success.ventilationrateunit);
      
    })
  }

  defaultInfiltration() {
    this.formgroup.controls.infiltrationknown.patchValue(this.defaultInfiltrationRate);
  }

}
