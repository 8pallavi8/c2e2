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
  coolingImageEffUnits: string;

  options = [{ value: 'Yes' }, { value: 'No' }, { value: 'N/A' }];
  acEfficiencyParameterList: string[] = ['EER', 'COP', 'SPC'];
  plugloadoptions: any;

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
      ventilationValue: ['0', Validators.compose([Validators.required])],
      ventilationUnits: ['', Validators.compose([Validators.required])],
      infiltration: [0, Validators.compose([Validators.required])],
      infiltrationValue: ['', Validators.compose([Validators.required])],
      infiltrationUnits: ['Air changes per Hour', Validators.compose([Validators.required])],
      economizer: ['', Validators.compose([Validators.required])],
      avgIndoorAirTemp: ['', Validators.compose([Validators.required])],
      avgIndoorAirTempUnit: ['', Validators.compose([Validators.required])],
      hvacCompressorInstalled: ['', Validators.compose([Validators.required])],
      hvacFansandBlowersInstalled: ['', Validators.compose([Validators.required])]
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
    if (sessionStorage.getItem('hvacDetails') !== null) {
      var hvacDetails = JSON.parse(sessionStorage.getItem('hvacDetails'));
      if (hvacDetails !== undefined || hvacDetails !== null) {
        console.log(hvacDetails);
        this.createCoolingEfficiencyForm(hvacDetails.airconditioning);
        this.createHeatingEfficiencyForm(hvacDetails.heatefficiency);
        this.formgroup.patchValue(hvacDetails);
        console.log(this.formgroup);
      }
    }
  }

  onChangecoolingEffOption(event: MatRadioChange) {
    (<FormArray>this.formgroup.get('coolefficiencyArray')).removeAt(0)
    this.createCoolingEfficiencyForm(event.value);
  }

  createCoolingEfficiencyForm(value: number) {
    if (value == 1) {
      (<FormArray>this.formgroup.get('coolefficiencyArray')).push(this.fb.group({
        acEfficiencyValue: ['', Validators.required],
        acEfficiencyParameter: ['', Validators.required],
        coolImages: ['', Validators.required],
        coolingEquipmentName: ['', Validators.required]
      }));
    } else if (value == 2) {
      (<FormArray>this.formgroup.get('coolefficiencyArray')).push(this.fb.group({
        coolImages: ['', Validators.required],
        acEfficiencyValue: ['', Validators.required],
        acEfficiencyUnits: ['', Validators.required],
        coolingEquipmentName: ['', Validators.required]
      }));
    }
    else if (value == 3) {
      (<FormArray>this.formgroup.get('coolefficiencyArray')).push(this.fb.group({
        acEfficiencyValue: ['', Validators.required],
        acEfficiencyUnits: ['', Validators.required],
        coolingEquipmentName: ['', Validators.required]
      }));
      this.openConfirmationDialogac()
    }
  }

  onChangeHeatEffOption(event: MatRadioChange) {
    (<FormArray>this.formgroup.get('heatefficiencyArray')).removeAt(0)
    this.createHeatingEfficiencyForm(event.value);
  }


  createHeatingEfficiencyForm(value: number) {
    if (value == 1) {
      (<FormArray>this.formgroup.get('heatefficiencyArray')).push(this.fb.group({
        heatefficiencyKnown: ['', Validators.required],
        heatEfficiencyUnits: ['', Validators.required],
        heatValueImages: ['', Validators.required],
        heatEquipmentName: ['', Validators.required]
      }));
    } else if (value == 2) {
      (<FormArray>this.formgroup.get('heatefficiencyArray')).push(this.fb.group({
        heatValueImages: ['', Validators.required],
        heatefficiency: ['', Validators.required],
        heatEfficiencyUnits: ['', Validators.required],
        heatEquipmentName: ['', Validators.required]
      }));
    }
    else if (value == 3) {
      (<FormArray>this.formgroup.get('heatefficiencyArray')).push(this.fb.group({
        heatefficiency: ['', Validators.required],
        heatEfficiencyUnits: ['', Validators.required],
        heatEquipmentName: ['', Validators.required]
      }));
      this.openConfirmationDialog()
    }
  }


  public openConfirmationDialog() {
    this.confirmationDialog.confirm('Confirm', 'You have selected No Heating Equipment In The Building', 'OK', null)
      .catch(() => console.log('User dismissed the dialog'));
      (<FormGroup>(<FormArray>this.formgroup.get('heatefficiencyArray')).at(0)).controls.heatefficiency.patchValue(0);
        (<FormGroup>(<FormArray>this.formgroup.get('heatefficiencyArray')).at(0)).controls.heatEfficiencyUnits.patchValue('');
        (<FormGroup>(<FormArray>this.formgroup.get('heatefficiencyArray')).at(0)).controls.heatEquipmentName.patchValue("No Heating Equipment");

  }


  public openConfirmationDialogac() {
    this.confirmationDialog.confirm('Confirm', 'You have selected No Cooling Equipment In The Building', 'OK', null)
      .catch(() => console.log('User dismissed the dialog'));
      (<FormGroup>(<FormArray>this.formgroup.get('coolefficiencyArray')).at(0)).controls.acEfficiencyValue.patchValue(0);
      (<FormGroup>(<FormArray>this.formgroup.get('coolefficiencyArray')).at(0)).controls.acEfficiencyUnits.patchValue('');
      (<FormGroup>(<FormArray>this.formgroup.get('coolefficiencyArray')).at(0)).controls.coolingEquipmentName.patchValue("No Cooling Equipment");

  }

  processHeatCoolEvent(event, type) {
    if (type == 'heating' && this.formgroup.controls.heatefficiency.value == 1) {
      (<FormGroup>(<FormArray>this.formgroup.get('heatefficiencyArray')).at(0)).controls.heatEquipmentName.patchValue(event.value);
    } else if (type == 'cooling' && this.formgroup.controls.airconditioning.value == 1) {
      (<FormGroup>(<FormArray>this.formgroup.get('coolefficiencyArray')).at(0)).controls.coolingEquipmentName.patchValue(event.value);
    } else {
      this.postCalculateEquipEfficiency(type, event.value);
    }
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
        (<FormGroup>(<FormArray>this.formgroup.get('heatefficiencyArray')).at(0)).controls.heatefficiency.patchValue(res.success.efficiency);
        (<FormGroup>(<FormArray>this.formgroup.get('heatefficiencyArray')).at(0)).controls.heatEfficiencyUnits.patchValue(res.success.efficiencyunit);
        (<FormGroup>(<FormArray>this.formgroup.get('heatefficiencyArray')).at(0)).controls.heatEquipmentName.patchValue(equipname);

      } else
        if (type == 'cooling') {
          (<FormGroup>(<FormArray>this.formgroup.get('coolefficiencyArray')).at(0)).controls.acEfficiencyValue.patchValue(res.success.efficiency);
          (<FormGroup>(<FormArray>this.formgroup.get('coolefficiencyArray')).at(0)).controls.acEfficiencyUnits.patchValue(res.success.efficiencyunit);
          (<FormGroup>(<FormArray>this.formgroup.get('coolefficiencyArray')).at(0)).controls.coolingEquipmentName.patchValue(equipname);
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
      this.formgroup.controls.ventilationValue.patchValue(res.success.ventilationrate);
      this.formgroup.controls.ventilationUnits.patchValue(res.success.ventilationrateunit);

    })
  }

  defaultInfiltration() {
    this.formgroup.controls.infiltrationValue.patchValue(this.defaultInfiltrationRate);
  }

}
