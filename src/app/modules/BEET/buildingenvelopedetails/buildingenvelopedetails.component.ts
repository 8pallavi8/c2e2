import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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

export interface outerRValues {
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
  outerRData: outerRValues[];
  roofRData: outerRValues[];
  formgroup: FormGroup;
  outerWallRValue: number;
  outerWallRUnits: string[] = ['m2.degC/W', 'ft2.degF.h/BTU']
  RoofRValue: number;
  windowRValue: number;
  hasSHGC: boolean = false;
  hasWWR: boolean = false;
  selectedLayerValue: number;
  selectedRoofLayerValue: number;
  selectedCapa: string;
  selectedMaterial: string;
  SHGC: number;
  selCountryCode: string;
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
      outerwallRKnown: ['0', Validators.compose([Validators.required])],
      outerwallrUnits: ['', Validators.compose([Validators.required])],
      roofr: ['', Validators.compose([Validators.required])],
      roofRKnown: ['0', Validators.compose([Validators.required])],
      roofrUnits: ['', Validators.compose([Validators.required])],
      rimages: ['0', Validators.compose([Validators.required])],
      windowr: ['', Validators.compose([Validators.required])],
      windowRKnown: ['0', Validators.compose([Validators.required])],
      windowrUnits: ['', Validators.compose([Validators.required])],
      SHGC: ['', Validators.compose([Validators.required])],
      SHGCknown: ['0', Validators.compose([Validators.required])],
      wwr: ['0', Validators.compose([Validators.required])]
    })
    this.beetService.getSelectedCountry().subscribe(res => { this.selCountryCode = res; console.log(this.selCountryCode); });
    this.beetService.getGeneralDetails().subscribe(res => {
      // console.log("building Envelop "+JSON.stringify(res.success.buildingdata));
      this.outerRData = res.success.rvaluewall;
      this.roofRData = res.success.rvalueroof;

    });
  }


  onOptionsSelected(event) {
    console.log(event.value);
    if (event.value == 'Camara de aire') {
      this.openCamaraDie();
    }
    else if (event.value == 'Ladrillo comun-picture options') {
      this.openLadrillo();
    }
    else if (event.value == 'Select more from list of materials') {
      this.openlistOfMaterials();
    }
  }


  onOptionsSelectedroof(event) {
    console.log(event.value);
    if (event.value == 'Camara de aire') {
      this.openCamaraDie();
    }
    else if (event.value == 'Ladrillo comun-picture options') {
      this.openLadrilloroof();
    }
    else if (event.value == 'Select more from list of materials') {
      this.openlistOfMaterials();
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
      this.addRoofLayerValues('', result);

    });
  }


  public openCamaraDie() {
    const dialogref = this.dialog.open(OuterwallAdvLevelAirComponent, {
      width: '60%',
      autoFocus: false,
      maxHeight: '90vh',
    });
    dialogref.afterClosed().subscribe(result => {
      this.addBuildingLayerValues(result.airLayerThickness, result.chamberSurface,);
      console.log(result);
    });
  }

  public openLadrillo() {
    const dialogref = this.dialog.open(OuterwallAdvLevelbrickComponent, {
      width: '80%',
      autoFocus: false,
      maxHeight: '100vh',
    });
    dialogref.afterClosed().subscribe(result => {
      console.log(result);
      this.addBuildingLayerValues('', result);

    });
  }


  public openlistOfMaterials() {
    const dialogref = this.dialog.open(OuterwallRadvancedleveldialogComponent, {
      width: '60%',
      autoFocus: false,
      maxHeight: '90vh',
    });
    dialogref.afterClosed().subscribe(result => {
      console.log(result);
    });
  }


  public addBuildingLayerValues(chamberSurface, airLayerThickness) {
    let layerInput: BuildingLayerValues;
    console.log("callingLayer ");
    //this.selectedLayerValue
    layerInput =
    {
      Layer: this.selectedLayerValue,
      Capadelelementoconstructivo: this.selectedCapa,
      Espesordecadacapa: chamberSurface,
      Resistenciatermica: airLayerThickness
    }
    this.layerValues.splice(this.selectedLayerValue, 1, layerInput)
    this.calculateSum(this.layerValues);
    this.dataSource = new MatTableDataSource(this.layerValues);
  }
  public calculateSum(tempArray: BuildingLayerValues[]) {
    let avgLayerValue = null;
    for (var i = 0; i <= 11; i++) {
      if (tempArray[i] != null) {
        avgLayerValue += tempArray[i].Resistenciatermica;
      }
    }
    const [last] = tempArray.slice(-1);
    last.Resistenciatermica = avgLayerValue.toFixed(2);
  }
  public addRoofLayerValues(chamberSurface, airLayerThickness) {

    let layerInput: BuildingLayerValues;
    console.log("callingLayer ");
    //this.selectedLayerValue
    layerInput =
    {
      Layer: this.selectedRoofLayerValue,
      Capadelelementoconstructivo: this.selectedMaterial,
      Espesordecadacapa: chamberSurface,
      Resistenciatermica: airLayerThickness
    }

    this.roofLayerValues.splice(this.selectedRoofLayerValue, 1, layerInput)
    this.calculateSum(this.roofLayerValues);
    this.roofdataSource = new MatTableDataSource(this.roofLayerValues);
  }

  /* public openOuterWallImagesR() {
    const dialogref = this.dialog.open(OuterwallAdvLevelbrickComponent, {
      width: '60%',
      autoFocus: false,
      maxHeight: '90vh',
    });
    dialogref.afterClosed().subscribe(result => {
      //this.outerWallRValue = result;
      console.log("test");
      console.log(result);
      this.addBuildingLayerValues(result);
    });
  } */


  /* public openOuterWallAdvancedR() {
    const dialogref = this.dialog.open(OuterwallRadvancedleveldialogComponent, {
      width: '60%',
      autoFocus: false,
      maxHeight: '90vh',
    });
    dialogref.afterClosed().subscribe(result => {
      this.addBuildingLayerValues(result);
      console.log(result);
    });
  } */

  public openRoofR() {
    this.inputDialog.entervalue('R Value-Roof',
      'I know the R value of the Roof for my building.',
      'You may choose to enter the values for any of the units mentioned below, Necessary units conversions will be made by the tool for respective calculations.',
      'OK',
      'cancel',
      'R value in [sqmt.°C/W]:',
      'R value in [sqft.°F/BTU]:')
      .then((confirmed) => { this.RoofRValue = confirmed })
      .catch(() => console.log('User dismissed the dialog'));
  }

  public openRoofImagesR() {
    const dialogref = this.dialog.open(RvalueImagedialogComponent, {
      width: '60%',
      autoFocus: false,
      maxHeight: '90vh',
    });
    dialogref.afterClosed().subscribe(result => {
      this.RoofRValue = result;
      console.log(result);
    });
  }


  public openWindowR() {
    this.inputDialog.entervalue('R Value-Window',
      'I know the R value of the Window for my building.',
      'You may choose to enter the values for any of the units mentioned below, Necessary units conversions will be made by the tool for respective calculations.',
      'OK',
      'cancel',
      'R value in [sqmt.°C/W]:',
      'R value in [sqft.°F/BTU]:')
      .then((confirmed) => { this.windowRValue = confirmed })
      .catch(() => console.log('User dismissed the dialog'));
  }

  public openWindowPredefinedR() {
    const dialogref = this.dialog.open(WindowRdialogComponent, {
      width: '60%',
      autoFocus: false,
      maxHeight: '90vh',
    });
    dialogref.afterClosed().subscribe(result => {
      this.windowRValue = result;
      console.log(result);
    });

  }

  showSHGC(state: boolean): void {
    if (state == true) {
      this.hasSHGC = true;
      this.SHGC = 0;
    }
    else {
      this.hasSHGC = false;
      this.SHGC = 0.25;
    }
  }

  showWWR(state: boolean): void {
    if (state == true)
      this.hasWWR = true;
    else
      this.hasWWR = false;
  }

}
