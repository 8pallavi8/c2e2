import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime } from 'rxjs/operators';
import { ConfirmationDialogService } from 'src/app/shared/services/confirmation-dialog.service';
import { InputdialogService } from 'src/app/shared/services/inputdialog.service';
import { ToolsService } from 'src/app/shared/services/tools.service';

@Component({
  selector: 'app-gendetails',
  templateUrl: './gendetails.component.html',
  styleUrls: ['./gendetails.component.scss']
})
export class GendetailsComponent implements OnInit {
  formGroup: FormGroup;
  inputTableDataSource: any;
  inputDisplayedColumns: string[] = ['option', 'select']
  dialogref: any;
  units: string = "squarefeet";
  textBoxData: string[] = ["bowling Aalley", "game arcades", "health club",
    "swimming", "disco", "gym", "gambling"];
  selecteditems: string[];
  hasOccupancy: boolean = false;
  hasOccupancyDensity: boolean = false;
  occupancyValue: number;
  countrylist:string[] = ['Argentina', 'India'];
  provincelist:string[] = ['CC Chaco', 'CH Chubut'];
  locationlist:string[] = ['CC Resistencia', 'CC Saenz Pena'];
  buildingTypeList:string[] = ['Correctional Facilities', 'Retail'];
  spacesList:string[] = ['Correctional Facilities', 'Retail'];
  unitslist = ["kgCO2/mmbtu","lbsCO2/mmbtu","kgCO2/therm","lbsCO2/therm","kgCO2/kcal","lbsCO2/kcal","kgCO2/m3","lbsCO2/ft3","metrictonsCO2/Mcf"];
  fuelunitslist = ["kgCO2/mmbtu","lbsCO2/mmbtu","kgCO2/therm","lbsCO2/therm","kgCO2/kcal","lbsCO2/kcal","kgCO2/m3","lbsCO2/ft3","metrictonsCO2/Mcf"];


  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private inputDialog: InputdialogService,
    private DialogService: ConfirmationDialogService) { }

  ngOnInit(): void {
    this.formGroup = this.createForm();
    this.formGroup.get('occupancyValueKnown').valueChanges.pipe(debounceTime(1000)).subscribe((changes) => {
      this.occupancyValue = changes;
      console.log(changes);
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      UserName: ['', Validators.compose([Validators.required])],
      ProjectName: ['', Validators.compose([Validators.required])],
      Country: ['', Validators.compose([Validators.required])],
      Province: ['', Validators.compose([Validators.required])],
      Location: ['', Validators.compose([Validators.required])],
      Buildingtype: ['', Validators.compose([Validators.required])],
      Categories: ['', Validators.compose([Validators.required])],
      Yearofconstruction: ['', Validators.compose([Validators.required])],
      Buildinggrossarea: ['', Validators.compose([Validators.required])],
      Netoccupiedfloorarea: ['', Validators.compose([Validators.required])],
      Nooffloors: ['', Validators.compose([Validators.required])],
      Occupanyhoursperweek: ['', Validators.compose([Validators.required])],
      occupancy: ['', Validators.compose([Validators.required])],
      occupancyValueKnown: ['', Validators.compose([Validators.required])],
      Electricitycost: ['', Validators.compose([Validators.required])],
      Fuelcost: ['', Validators.compose([Validators.required])],
      fuelunits: ['', Validators.compose([Validators.required])],
      units: ['', Validators.compose([Validators.required])]
    });
  }

  showOccupancy(state: boolean): void {
    if (state == true) {
      this.hasOccupancy = true;
      //  this.occupancy = 0;
    }
    else {
      this.hasOccupancy = false;
      this.occupancyValue = 5;
    }
  }

  showOccupantDensity(state: boolean): void {
    this.hasOccupancy = false;
    this.openOccupantDensity();
  }


  public openOccupantDensity() {
    this.inputDialog.entervalue('Occupancy people',
      'I know the occupant density of the building in [square meter per person] or [square feet per person].',
      'You may choose to enter the values for any of the units mentioned below, Necessary units conversions will be made by the tool for respective calculations.',
      'OK',
      'cancel',
      'Occupant density in [square meter per person]:',
      'Occupant density in  [square feet per person]:')
      .then((confirmed) => { this.occupancyValue = confirmed })
      .catch(() => console.log('User dismissed the dialog'));
  }



}




