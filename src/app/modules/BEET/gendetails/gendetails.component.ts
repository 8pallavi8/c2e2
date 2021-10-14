import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BuildingDetails, LocationDetails } from 'src/app/shared/models/models';
import { beetService } from 'src/app/shared/services/beet.service';
import { ConfirmationDialogService } from 'src/app/shared/services/confirmation-dialog.service';
import { InputdialogService } from 'src/app/shared/services/inputdialog.service';


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

  genDetailsForm: FormGroup;
  inputTableDataSource: any;
  inputDisplayedColumns: string[] = ['option', 'select']
  dialogref: any;
  netUnits: string = 'square feet';
  grossUnits: string = 'square feet';
  selecteditems: string[];
  hasOccupancy: boolean = false;
  hasOccupancyDensity: boolean = false;
  occupancyValue: number;
  countrylist: CountryTable[];
  locationlist: string[] = [];
  spacesList: string[] = [];
  eletricityunitslist = [];
  fuelunitslist = [];
  locationDetails: LocationDetails[] = [];
  buildingDetails: BuildingDetails[] = [];

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private inputDialog: InputdialogService,
    private beetService: beetService) { }

  ngOnInit(): void {
    this.genDetailsForm = this.fb.group({
      userName: ['', Validators.compose([Validators.required])],
      projectName: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],
      province: ['', Validators.compose([Validators.required])],
      location: ['', Validators.compose([Validators.required])],
      buildingType: ['', Validators.compose([Validators.required])],
      buildingSpaces: ['', Validators.compose([Validators.required])],
      yearOfConstruction: ['', Validators.compose([Validators.required])],
      buildingGrossArea: [''],
      Netoccupiedfloorarea: ['', Validators.compose([Validators.required])],
      Nooffloors: ['', Validators.compose([Validators.required])],
      Occupanyhoursperweek: ['', Validators.compose([Validators.required])],
      occupancyDensity: ['', Validators.compose([Validators.required])],
      noOfPeopleOccupying: [0, Validators.compose([Validators.required])],
      occupantDensityUnits: ['square feet', Validators.compose([Validators.required])],
      Electricitycost: ['', Validators.compose([Validators.required])],
      Fuelcost: ['', Validators.compose([Validators.required])],
      fuelunits: ['', Validators.compose([Validators.required])],
      grossAreaUnits: ['square feet', Validators.compose([Validators.required])],
      netAreaUnits: ['', Validators.compose([Validators.required])],
      electricityunits: ['', Validators.compose([Validators.required])],
      //occupancyValue: [0, Validators.compose([Validators.required])],
      occupantDensityKnown: [0, Validators.compose([Validators.required])],

    });;
    this.getcountryList();
  }

  getcountryList(): void {
    this.beetService.getCountries().subscribe(res => {
      this.countrylist = res.success.countrydetails;
    });
  }

  onChangeCountry(selectedCountry){
    this.beetService.setSelectedCountry(selectedCountry.value);
    this.beetService.getGeneralData(selectedCountry.value.toString()).subscribe(res => {
      console.log(res.success);
      this.locationDetails = res.success.locationdata;
      this.buildingDetails = res.success.buildingdata;
      this.eletricityunitslist = res.success.energycostunits.electricitycostunits;
      this.fuelunitslist = res.success.energycostunits.fuelcostunits;
    });

  }

  onChangeProvince(event){
    console.log(event.value);
    this.locationlist = this.locationDetails.find(ele => ele.province == event.value).locations;
  }

  onChangeBuildingType(event){
    console.log(event.value);
    this.spacesList = this.buildingDetails.find(ele => ele.buildingtype == event.value).buildingspaces;
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




