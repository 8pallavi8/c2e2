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
  occupancyUnits: string = 'square feet';
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
  selectedCountryCode : CountryTable;

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
      buildingGrossArea: ['0'],
      Netoccupiedfloorarea: ['', Validators.compose([Validators.required])],
      Nooffloors: ['', Validators.compose([Validators.required])],
      Occupanyhoursperweek: ['', Validators.compose([Validators.required])],
      occupantDensity: ['', Validators.compose([Validators.required])],
      noOfPeopleOccupying: [0, Validators.compose([Validators.required])],
      occupantDensityUnits: ['', Validators.compose([Validators.required])],
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
    console.log("code:"+this.countrylist)
  }

  getcountryList(): void {
    this.beetService.getCountries().subscribe(res => {
      this.countrylist = res.success.countrydetails;
    });
  }

  onChangeCountry(selectedCountry){
    this.beetService.setSelectedCountry(selectedCountry.value);
    this.selectedCountryCode = selectedCountry.value;
    this.beetService.getGeneralData(selectedCountry.value.toString()).subscribe(res => {
      this.locationDetails = res.success.locationdata;
      this.buildingDetails = res.success.buildingdata;
      console.log("General details "+res.success.buildingdata);
      this.eletricityunitslist = res.success.energycostunits.electricitycostunits;
      this.fuelunitslist = res.success.energycostunits.fuelcostunits;
      this.beetService.setGeneralDetails(res);
    });
  }


  onChangeProvince(event){
    this.beetService.setSelectedProvince(event.value);
    console.log(event.value);
    this.locationlist = this.locationDetails.find(ele => ele.province == event.value).locations;
  }

  onChangeBuildingType(event){
    this.beetService.setSelectedbuildingType(event.value);
    console.log(event.value);
    this.spacesList = this.buildingDetails.find(ele => ele.buildingtype == event.value).buildingspaces;
  }


  onChangeBuildingSpaces(event){
    this.beetService.setSelectedbuildingSpaces(event.value);
  }

  calculateGross(event:any){
    
    if (this.genDetailsForm.controls.buildingGrossArea.value == 0 && this.genDetailsForm.controls.netAreaUnits.value != undefined)
      {
      this.genDetailsForm.controls['grossAreaUnits'].setValue(this.genDetailsForm.controls.netAreaUnits.value );
      this.genDetailsForm.controls['buildingGrossArea'].setValue( event.target.value*1.1);
    }
  }

  postCalculateOccupancyPeople(): void {
    var payload: any = {
      "noofpeople": this.genDetailsForm.controls.noOfPeopleOccupying.value,
      "buildinggrossarea": this.genDetailsForm.controls.buildingGrossArea.value,
      "buildinggrossareaunit":this.genDetailsForm.controls.buildingSpaces.value
    }
    console.log(payload);
    this.beetService.postCalculateOccupancyPeople(payload).subscribe(res =>{
      console.log(res.success);

      this.genDetailsForm.controls['occupantDensityKnown'].setValue(res.success);
      
    })
  } 

   postCalculateOccupancyUnknown(): void {
    var payload: any = {
      "countrycode": this.selectedCountryCode,
      "buildingtype": this.genDetailsForm.controls.buildingType.value,
      "buildingspaces":this.genDetailsForm.controls.buildingSpaces.value
    }
    this.beetService.postCalculateOccupancyUnknown(payload).subscribe(res =>{
      console.log(res.success.occupantdensity);
      this.genDetailsForm.controls['occupantDensityKnown'].setValue(res.success.occupantdensity);
      
    })
  }  
}