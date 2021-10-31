import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime } from 'rxjs/operators';
import { OuterwallAdvLevelAirComponent } from 'src/app/shared/outerwall-adv-level-air/outerwall-adv-level-air.component';
import { OuterwallAdvLevelbrickComponent } from 'src/app/shared/outerwall-adv-levelbrick/outerwall-adv-levelbrick.component';
import { OuterwallRadvancedleveldialogComponent } from 'src/app/shared/outerwall-radvancedleveldialog/outerwall-radvancedleveldialog.component';
import { RoofradvancedComponent } from 'src/app/shared/roofradvanced/roofradvanced.component';
import { RvalueImagedialogComponent } from 'src/app/shared/rvalue-imagedialog/rvalue-imagedialog.component';
import { beetService } from 'src/app/shared/services/beet.service';
import { InputdialogService } from 'src/app/shared/services/inputdialog.service';
import { WindowRdialogComponent } from 'src/app/shared/window-rdialog/window-rdialog.component';



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
  selProvince: string;
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
      wwr: [0, Validators.compose([Validators.required])],
      wwrArray:this.fb.array([]),
     
    })
    this.beetService.getSelectedCountry().subscribe(res => { this.selCountryCode = res; });
    this.beetService.getSelectedProvince().subscribe(res => { this.selProvince = res; console.log(res); });
    this.beetService.getGeneralDetails().subscribe(res => {
      this.outerRData = res.success.rvaluewall;
      this.roofRData = res.success.rvalueroof;
    });
  }

  onChangeOuterWallROption(event: MatRadioChange) {
    console.log(this.formgroup.get('outerWallArray'));
    (<FormArray>this.formgroup.get('outerWallArray')).removeAt(0);
    console.log("change : "+event.value);

    if (event.value == 1) {
      (<FormArray>this.formgroup.get('outerWallArray')).push(this.fb.group({
        outerwallRKnown: ['', Validators.required],
        outerwallrUnits: ['', Validators.required],
      }));
    } else if (event.value == 2) {
      (<FormArray>this.formgroup.get('outerWallArray')).push(this.fb.group({
        rimages: ['', Validators.required],
      }));
    } else if (event.value == 3) {
      (<FormArray>this.formgroup.get('outerWallArray')).push(this.fb.group({
        rValueAdvanced: ['', Validators.required],
        outerwallrUnits: ['m²K/W', Validators.required],
      }));
    }
  }

  onChangeroofrOption(event: MatRadioChange) {
    console.log(this.formgroup.get('roofrArray'));
    (<FormArray>this.formgroup.get('roofrArray')).removeAt(0)

    if (event.value == 1) {
      (<FormArray>this.formgroup.get('roofrArray')).push(this.fb.group({
        roofRKnown: ['', Validators.required],
        roofrUnits: ['', Validators.required],
      }));
    } else if (event.value == 2) {
      (<FormArray>this.formgroup.get('roofrArray')).push(this.fb.group({
        roofrimages: ['', Validators.required],
      }));
    } else if (event.value == 3) {
      (<FormArray>this.formgroup.get('roofrArray')).push(this.fb.group({
        rValueAdvanced: ['', Validators.required],
        roofrUnits: ['', Validators.required],
      }));
    }
  }

  onChangewindowrOption(event: MatRadioChange) {
    console.log(this.formgroup.get('windowrArray'));
    (<FormArray>this.formgroup.get('windowrArray')).removeAt(0)
    if (event.value == 1) {
      (<FormArray>this.formgroup.get('windowrArray')).push(this.fb.group({
        windowRKnown: ['', Validators.required],
        windowrUnits: ['', Validators.required],
      }));
    } else if (event.value == 2) {
      (<FormArray>this.formgroup.get('windowrArray')).push(this.fb.group({
        windowRCaluclated: [this.windowRValue, Validators.required],
      }));
      const dialogref = this.dialog.open(WindowRdialogComponent, {
        width: '60%',
        autoFocus: false,
        maxHeight: '90vh',
      });
      dialogref.afterClosed().subscribe(result => {
        this.windowRValue = result;
      ( <FormGroup> (<FormArray>this.formgroup.get('windowrArray')).at(0)).controls.windowRCaluclated.patchValue(result);
        
      });
    }
  }

  onChangeWWROption(event: MatRadioChange) {
    console.log(this.formgroup.get('wwrArray'));
    (<FormArray>this.formgroup.get('wwrArray')).removeAt(0);

    if (event.value == 1) {
      (<FormArray>this.formgroup.get('wwrArray')).push(this.fb.group({
        wwrKnown: ['', Validators.required]
      }));
    } else if (event.value == 2) {
      (<FormArray>this.formgroup.get('wwrArray')).push(this.fb.group({
        wwrGuide: ['', Validators.required],
      }));
    } 
  }


  onOptionsSelected(event) {
    console.log(event.value);
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
      console.log(result.thickness, result.rvalue);
      if (typeofroof == 0) {
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
      if (result != undefined) {
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
      console.log("adv" + result);
      if (typeofroof == 0) {
        this.addOuterWallLayerValues(result.thickness, result.rvalue);
      } else {
        this.addRoofLayerValues(result.thickness, result.rvalue);
      }
    });
  }


  public addOuterWallLayerValues(thickness, Rvalue) {
    let layerInput: BuildingLayerValues;
    console.log("callingLayer ");
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
      this.formgroup.get('roofrArray')['controls'][0].controls?.rValueAdvanced?.setValue(last.Resistenciatermica);
    }
  }

  onOptionsSelectedroof(event) {
    console.log(event.value);
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
      console.log(result);
      if (result != undefined) {
        this.addRoofLayerValues('', result);
      }
    });
  }

  public addRoofLayerValues(thickness, Rvalue) {
    let layerInput: BuildingLayerValues;
    console.log("callingLayer ");
    //this.selectedLayerValue
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
      "province": this.selProvince
    }
    console.log(payload);
    this.beetService.postCalculateshgc(payload).subscribe(res => {
      this.formgroup.controls.SHGCknown.patchValue(res.success);
    });
  }

}
