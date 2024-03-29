import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogState } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatTableDataSource } from '@angular/material/table';
import { OuterwallAdvLevelAirComponent } from 'src/app/shared/outerwall-adv-level-air/outerwall-adv-level-air.component';
import { OuterwallAdvLevelbrickComponent } from 'src/app/shared/outerwall-adv-levelbrick/outerwall-adv-levelbrick.component';
import { OuterwallRadvancedleveldialogComponent } from 'src/app/shared/outerwall-radvancedleveldialog/outerwall-radvancedleveldialog.component';
import { RoofradvancedComponent } from 'src/app/shared/roofradvanced/roofradvanced.component';
import { beetService } from 'src/app/shared/services/beet.service';
import { InputdialogService } from 'src/app/shared/services/inputdialog.service';
import { WindowRdialogComponent } from 'src/app/shared/window-rdialog/window-rdialog.component';
import { BEETComponent } from '../beet.component';


export interface BuildingLayerValues {
  Layer: number;
  Capadelelementoconstructivo: string;
  Espesordecadacapa: number;
  Resistenciatermica: number;
}

export interface ImageRValues {
  imagepath: string;
  rvalue: number;
  units: string;
}

export interface OutputR {
  rvalue: number;
  runit: string;
}


@Component({
  selector: 'app-buildingenvelopedetails',
  templateUrl: './buildingenvelopedetails.component.html',
  styleUrls: ['./buildingenvelopedetails.component.scss']
})
export class BuildingenvelopedetailsComponent implements OnInit {

  @Input() countryCode: string;
  outerRData: ImageRValues[];
  roofRData: ImageRValues[];
  formgroup: FormGroup;
  outerWallRValue: number;
  outerWallRUnits: string[] = ['m².°C/W', 'ft2.°F/BTU']
  RoofRValue: number;
  roofRUnits: string[] = ['m².°C/W', 'ft2.°F/BTU']
  windowRValue: number;
  hasSHGC: boolean = false;
  hasWWR: boolean = false;
  selectedLayerValue: number;
  selectedRoofLayerValue: number;
  selectedCapa: string;
  selectedMaterial: string;
  SHGC: number;
  selCountryCode: string;
  beetComponent : BEETComponent;

  layersList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  elementsList = ["Camara de aire", "Ladrillo comun-picture options", "Select more from list of materials"]
  displayedColumns: string[] = ['Layer', 'Capadelelementoconstructivo', 'Espesordecadacapa', 'Resistenciatermica'];
  layerValues: BuildingLayerValues[] = [
    { Layer: null, Capadelelementoconstructivo: 'Resistencia superficial exterior', Espesordecadacapa: null, Resistenciatermica: 0.04 },
    { Layer: 1, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 2, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 3, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 4, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 5, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 6, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 7, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 8, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 9, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 10, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: null, Capadelelementoconstructivo: 'Resistencia superficial interior', Espesordecadacapa: null, Resistenciatermica: 0.13 },
    { Layer: null, Capadelelementoconstructivo: 'Total', Espesordecadacapa: null, Resistenciatermica: null },
  ];
  roofLayerValues: BuildingLayerValues[] = [
    { Layer: null, Capadelelementoconstructivo: 'Resistencia superficial exterior', Espesordecadacapa: null, Resistenciatermica: 0.04 },
    { Layer: 1, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 2, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 3, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 4, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 5, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 6, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 7, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 8, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 9, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: 10, Capadelelementoconstructivo: '', Espesordecadacapa: null, Resistenciatermica: null },
    { Layer: null, Capadelelementoconstructivo: 'Resistencia superficial interior', Espesordecadacapa: null, Resistenciatermica: 0.13 },
    { Layer: null, Capadelelementoconstructivo: 'Total', Espesordecadacapa: null, Resistenciatermica: null },
  ];
  dataSource = new MatTableDataSource(this.layerValues);
  roofdataSource = new MatTableDataSource(this.roofLayerValues);
  windowRdialogref: any;

  constructor(private fb: FormBuilder,
    private inputDialog: InputdialogService,
    public dialog: MatDialog,
    private beetService: beetService) { }

  ngOnInit(): void {
    this.formgroup = this.fb.group({
      outerwallr: ['', Validators.compose([Validators.required])],
      outerWallArray: this.fb.array([]),
      roofr: ['', Validators.compose([Validators.required])],
      roofrArray: this.fb.array([]),
      windowr: ['', Validators.compose([Validators.required])],
      windowrArray: this.fb.array([]),
      SHGC: ['', Validators.compose([Validators.required])],
      SHGCknown: [0, Validators.compose([Validators.required])],
      wwr: [, Validators.compose([Validators.required])],
      wwrArray: this.fb.array([]),
    })
    this.beetService.getSelectedCountry().subscribe(res => { this.selCountryCode = res; });
    this.beetComponent = this.beetService.getBEETParentComponent();

    this.beetService.getGeneralDetails().subscribe(res => {
      this.outerRData = res.success.rvaluewall;
      this.roofRData = res.success.rvalueroof;
    });
    if (sessionStorage.getItem('buildingEnvDetails') !== null) {
      var buildingEnvDetails = JSON.parse(sessionStorage.getItem('buildingEnvDetails'));
      if (buildingEnvDetails !== undefined || buildingEnvDetails !== null) {
    
        this.createOuterWallForm(buildingEnvDetails.outerwallr);
        this.createRoofRForm(buildingEnvDetails.roofr);
        this.createWindowRForm(buildingEnvDetails.windowr);
        this.createWWRForm(buildingEnvDetails.wwr);
        this.formgroup.patchValue(buildingEnvDetails);
      }
    }
  }

  onChangeOuterWallROption(event: MatRadioChange) {
    (<FormArray>this.formgroup.get('outerWallArray')).removeAt(0);
    this.createOuterWallForm(event.value);
  }

  createOuterWallForm(value: number) {
    if (value == 1) {
      (<FormArray>this.formgroup.get('outerWallArray')).push(this.fb.group({
        outerwallRKnown: ['', Validators.compose([Validators.required,Validators.min(0)])],
        outerwallrUnits: ['', Validators.required],
      }));
    } else if (value == 2) {
      (<FormArray>this.formgroup.get('outerWallArray')).push(this.fb.group({
        rimages: ['', Validators.required],
      }));
    } else if (value == 3) {
      (<FormArray>this.formgroup.get('outerWallArray')).push(this.fb.group({
        rValueAdvanced: ['', Validators.compose([Validators.required,Validators.min(0)])],
        outerwallrUnits: ['m²K/W', Validators.required],
      }));
    }
  }


  onChangeroofrOption(event: MatRadioChange) {
    (<FormArray>this.formgroup.get('roofrArray')).removeAt(0)
    this.createRoofRForm(event.value);
  }

  createRoofRForm(value: number) {
    if (value == 1) {
      (<FormArray>this.formgroup.get('roofrArray')).push(this.fb.group({
        roofRKnown: ['', Validators.compose([Validators.required,Validators.min(0)])],
        roofrUnits: ['', Validators.required],
      }));
    } else if (value == 2) {
      (<FormArray>this.formgroup.get('roofrArray')).push(this.fb.group({
        roofrimages: ['', Validators.required],
      }));
    } else if (value == 3) {
      (<FormArray>this.formgroup.get('roofrArray')).push(this.fb.group({
        rroofValueAdvanced: ['', Validators.compose([Validators.required,Validators.min(0)])],
        roofrUnits: ['m²K/W', Validators.required],
      }));
    }
  }

  onWindowNoOption(event){
    if(this.windowRdialogref != null && this.windowRdialogref.getState() != MatDialogState.OPEN){
      this.onChangewindowrOption(new MatRadioChange(event.target,2));
    }
  }
  onChangewindowrOption(event: MatRadioChange) {
    (<FormArray>this.formgroup.get('windowrArray')).removeAt(0);
    this.createWindowRForm(event.value);
    if (event.value == 2) {
      this.windowRdialogref = this.dialog.open(WindowRdialogComponent, {
        width: '60%',
        autoFocus: false,
        maxHeight: '90vh',
      });
      this.windowRdialogref.afterClosed().subscribe(result => {
        (<FormGroup>(<FormArray>this.formgroup.get('windowrArray')).at(0)).controls.windowRCaluclated.patchValue(result.rvalue);
        (<FormGroup>(<FormArray>this.formgroup.get('windowrArray')).at(0)).controls.windowRCaluclatedUnits.patchValue(result.rvalueunit);
      });
    }
  }

  createWindowRForm(value: number) {
    if (value == 1) {
      (<FormArray>this.formgroup.get('windowrArray')).push(this.fb.group({
        windowRKnown: ['', Validators.compose([Validators.required,Validators.min(0)])],
        windowrUnits: ['', Validators.required],
      }));
    } else if (value == 2) {
      (<FormArray>this.formgroup.get('windowrArray')).push(this.fb.group({
        windowRCaluclated: ['', Validators.compose([Validators.required,Validators.min(0)])],
        windowRCaluclatedUnits: [this.windowRValue, Validators.required],

      }));
    }
  }

  onChangeWWROption(event: MatRadioChange) {
    (<FormArray>this.formgroup.get('wwrArray')).removeAt(0);
    this.createWWRForm(event.value);
  }

  createWWRForm(value: number) {
    if (value == 1) {
      (<FormArray>this.formgroup.get('wwrArray')).push(this.fb.group({
        wwrKnown: ['', Validators.required]
      }));
    } else if (value == 2) {
      (<FormArray>this.formgroup.get('wwrArray')).push(this.fb.group({
        wwrGuide: ['', Validators.required],
      }));
    }
  }


  onOptionsSelected(event) {
    if (event.value == 'Camara de aire') {
      this.openCamaraDie(0);
    }
    else if (event.value == 'Ladrillo comun-picture options') {
      this.openLadrillo();
    }
    else if (event.value == 'Select more from list of materials') {
      this.openlistOfMaterials(0);
    }
  }

  public openCamaraDie(typeofroof: number) {
    const dialogref = this.dialog.open(OuterwallAdvLevelAirComponent, {
      width: '60%',
      autoFocus: false,
      maxHeight: '90vh',
    });
    dialogref.afterClosed().subscribe(result => {
      if(result == undefined){
        this.selectedCapa = '';
        this.selectedMaterial='';
      }
      else if (typeofroof == 0) {
        this.addOuterWallLayerValues(result.thickness, result.rvalue);
      } else {
        this.addRoofLayerValues(result.thickness, result.rvalue);
      }
    });
  }

  public openLadrillo() {
    const dialogref = this.dialog.open(OuterwallAdvLevelbrickComponent, {
      width: '80%',
      autoFocus: false,
      maxHeight: '100vh',
    });
    dialogref.afterClosed().subscribe(result => {
      if (result == undefined) {
        this.selectedCapa = '';
      }
      else if (result != undefined) {
        this.addOuterWallLayerValues('', result);
      }
    });
  }


  public openlistOfMaterials(typeofroof: number) {
    const dialogref = this.dialog.open(OuterwallRadvancedleveldialogComponent, {
      width: '60%',
      autoFocus: false,
      maxHeight: '90vh',
    });
    dialogref.afterClosed().subscribe(result => {
      if(result == undefined){
        this.selectedCapa = '';
      }
      else if (typeofroof == 0) {
        this.addOuterWallLayerValues(result.thickness, result.rvalue);
      } else {
        this.addRoofLayerValues(result.thickness, result.rvalue);
      }
    });
  }


  public addOuterWallLayerValues(thickness, Rvalue) {
    let layerInput: BuildingLayerValues;
    layerInput =
    {
      Layer: this.selectedLayerValue,
      Capadelelementoconstructivo: this.selectedCapa,
      Espesordecadacapa: thickness,
      Resistenciatermica: Rvalue
    }
    this.layerValues.splice(this.selectedLayerValue, 1, layerInput)
    this.calculateSum(this.layerValues);
    this.dataSource = new MatTableDataSource(this.layerValues);
    this.selectedCapa = '';
  }

  public calculateSum(tempArray: BuildingLayerValues[]) {
    let avgLayerValue = null;
    for (var i = 0; i <= 11; i++) {
      if (tempArray[i] != null) {
        avgLayerValue += tempArray[i].Resistenciatermica;
      }
    }
    const [last] = tempArray.slice(-1);
    last.Resistenciatermica = avgLayerValue;
    if (this.formgroup.controls.outerwallr.value == 3) {
      this.formgroup.get('outerWallArray')['controls'][0].controls.rValueAdvanced.setValue(last.Resistenciatermica);
    }
    if (this.formgroup.controls.roofr.value == 3) {
      this.formgroup.get('roofrArray')['controls'][0].controls?.rroofValueAdvanced?.setValue(last.Resistenciatermica);
    }
  }

  onOptionsSelectedroof(event) {
    if (event.value == 'Camara de aire') {
      this.openCamaraDie(1);
    }
    else if (event.value == 'Ladrillo comun-picture options') {
      this.openLadrilloroof();
    }
    else if (event.value == 'Select more from list of materials') {
      this.openlistOfMaterials(1);
    }
  }

  public openLadrilloroof() {
    const dialogref = this.dialog.open(RoofradvancedComponent, {
      width: '80%',
      autoFocus: false,
      maxHeight: '100vh',
    });
    dialogref.afterClosed().subscribe(result => {
      console.log("ladrillo"+result)
      if (result == undefined) {
        this.selectedMaterial = '';
      }else 
        {
        this.addRoofLayerValues('', result);
      }
    });
  }

  public addRoofLayerValues(thickness, Rvalue) {
    let layerInput: BuildingLayerValues;
    layerInput =
    {
      Layer: this.selectedRoofLayerValue,
      Capadelelementoconstructivo: this.selectedMaterial,
      Espesordecadacapa: thickness,
      Resistenciatermica: Rvalue
    }
    this.roofLayerValues.splice(this.selectedRoofLayerValue, 1, layerInput)
    this.calculateSum(this.roofLayerValues);
    this.roofdataSource = new MatTableDataSource(this.roofLayerValues);
    this.selectedMaterial = '';
  }

  postCalculateshgc(): void {
    var payload: any = {
      "countrycode": this.selCountryCode,
      "province": this.beetComponent.genDetailsComponent.genDetailsForm.controls.province.value
    }
    this.beetService.postCalculateshgc(payload).subscribe(res => {
      this.formgroup.controls.SHGCknown.patchValue(res.success);
    });
  }
}