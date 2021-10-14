import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime } from 'rxjs/operators';
import { beetService } from 'src/app/shared/services/beet.service';
import { ConfirmationDialogService } from 'src/app/shared/services/confirmation-dialog.service';
import { InputdialogService } from 'src/app/shared/services/inputdialog.service';
import { ToolsService } from 'src/app/shared/services/tools.service';


export interface CountryTable {
  country?: string;
  countrycode?: string;
}

@Component({
  selector: 'app-gendetails',
  templateUrl: './gendetails.component.html',
  styleUrls: ['./gendetails.component.scss'],

})
export class GendetailsComponent implements OnInit {
  formGroup: FormGroup;
  inputTableDataSource: any;
  inputDisplayedColumns: string[] = ['option', 'select']
  dialogref: any;
  netUnits: string = 'squarefeet';
  grossUnits: string = 'squarefeet';
  selecteditems: string[];
  hasOccupancy: boolean = false;
  hasOccupancyDensity: boolean = false;
  occupancyValue: number;
  countrylist: CountryTable[];
  provincelist: string[] = ['CC Chaco', 'CH Chubut'];
  locationlist: string[] = ['CC Resistencia', 'CC Saenz Pena'];
  buildingTypeList: string[] = ['Correctional Facilities', 'Retail', 'Sports'];
  spacesList: string[] = ["Bowling Aalley", "Game arcades", "Health club",
    "Swimming", "Disco", "Gym", "Gambling"];
  eletricityunitslist = ["kgCO2/mmbtu", "lbsCO2/mmbtu", "kgCO2/therm", "lbsCO2/therm", "kgCO2/kcal", "lbsCO2/kcal", "kgCO2/m3", "lbsCO2/ft3", "metrictonsCO2/Mcf"];
  fuelunitslist = ["kgCO2/mmbtu", "lbsCO2/mmbtu", "kgCO2/therm", "lbsCO2/therm", "kgCO2/kcal", "lbsCO2/kcal", "kgCO2/m3", "lbsCO2/ft3", "metrictonsCO2/Mcf"];


  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private inputDialog: InputdialogService,
    private DialogService: ConfirmationDialogService,
    private beetService: beetService) { }

  ngOnInit(): void {
    this.formGroup = this.createForm();
    this.getcountryList();
  }

  getcountryList(): void {
    this.beetService.getCountries().subscribe(res => {
      console.log(res.success.countrydetails);
  
      this.countrylist = res.success.countrydetails;
      console.log(this.countrylist)
    });
  }


  getGenDetailsList(selectedCountry){
    console.log(selectedCountry.value.toString());
    this.beetService.getGeneralData(selectedCountry.value.toString()).subscribe(res => {
      console.log(res.success);
      
    }) 
  }


  createForm(): FormGroup {
    return this.fb.group({
      UserName: ['', Validators.compose([Validators.required])],
      ProjectName: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],
      Province: ['', Validators.compose([Validators.required])],
      Location: ['', Validators.compose([Validators.required])],
      Buildingtype: ['', Validators.compose([Validators.required])],
      Categories: ['', Validators.compose([Validators.required])],
      Yearofconstruction: ['', Validators.compose([Validators.required])],
      Buildinggrossarea: [''],
      Netoccupiedfloorarea: ['', Validators.compose([Validators.required])],
      Nooffloors: ['', Validators.compose([Validators.required])],
      Occupanyhoursperweek: ['', Validators.compose([Validators.required])],
      occupancyDensity: ['', Validators.compose([Validators.required])],
      noOfPeopleOccupying: ['', Validators.compose([Validators.required])],
      OoccupantDensityUnits: ['', Validators.compose([Validators.required])],
      Electricitycost: ['', Validators.compose([Validators.required])],
      Fuelcost: ['', Validators.compose([Validators.required])],
      fuelunits: ['', Validators.compose([Validators.required])],
      grossAreaUnits: ['Square Feet', Validators.compose([Validators.required])],
      netAreaUnits: ['', Validators.compose([Validators.required])],
      electricityunits: ['', Validators.compose([Validators.required])],
      occupancyValue: ['', Validators.compose([Validators.required])],
      occupantDensityKnown: ['', Validators.compose([Validators.required])],

    });
  }

  showOccupancy(state: boolean): void {
    if (state == true) {
      this.hasOccupancy = true;
      this.hasOccupancyDensity = false;
      //  this.occupancy = 0;
    }
    else {
      this.hasOccupancy = false;
      this.hasOccupancyDensity = false;

    }
  }

  showOccupantDensity(state: boolean): void {
    this.hasOccupancy = false;
    this.hasOccupancyDensity = true;
    // this.openOccupantDensity();
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



    /* this.formGroup.get('occupancyValueKnown').valueChanges.pipe(debounceTime(1000)).subscribe((changes) => {
      this.occupancyValue = changes;
      console.log(changes);
    }); */



