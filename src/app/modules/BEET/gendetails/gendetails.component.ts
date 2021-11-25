import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { fromEvent } from 'rxjs';
import { debounceTime, max } from 'rxjs/operators';
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
  styleUrls: ['../beet.component.scss'],

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
  selectedCountryCode: CountryTable;
  isEnteredGross: boolean = false;
  @ViewChild("peopleOccupying") peopleOccupying: ElementRef;
  source: any;
  numRegex = /^[\d]*$/;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private inputDialog: InputdialogService,
    private beetService: beetService) { }

  ngOnInit(): void {
    this.genDetailsForm = this.fb.group({
      //userName: ['', Validators.compose([Validators.required])],
      //projectName: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],
      province: ['', Validators.compose([Validators.required])],
      location: ['', Validators.compose([Validators.required])],
      buildingType: ['', Validators.compose([Validators.required])],
      buildingSpaces: ['', Validators.compose([Validators.required])],
      //yearOfConstruction: ['', Validators.compose([Validators.required])],
      buildingGrossArea: [0],
      grossAreaUnits: [''],
      netOccupiedFloorArea: ['', Validators.compose([Validators.required])],
      netAreaUnits: ['', Validators.compose([Validators.required])],
      noOfFloors: ['', [Validators.required, Validators.pattern(this.numRegex)]],
      occupanyHoursPerWeek: ['', Validators.compose([Validators.required,Validators.max(168), Validators.min(0)])],
      occupantDensity: ['', Validators.compose([Validators.required,Validators.min(0)])],
      noOfPeopleOccupying: [0, Validators.compose([Validators.required,Validators.pattern(this.numRegex)])],
      occupantDensityUnits: ['', Validators.compose([Validators.required])],
      electricityCost: ['', Validators.compose([Validators.required])],
      fuelCost: ['', Validators.compose([Validators.required])],
      fuelUnits: ['', Validators.compose([Validators.required])],
      electricityUnits: ['', Validators.compose([Validators.required])],
      occupantDensityKnown: [0, Validators.compose([Validators.required])],
    });;
    this.getcountryList();
    if (sessionStorage.getItem('generalDetails') !== null) {
      var generalDetails = JSON.parse(sessionStorage.getItem('generalDetails'));
      if (generalDetails !== undefined || generalDetails !== null) {
        let res = this.beetService.getGeneralDetails().subscribe(res => {
          this.locationDetails = res.success.locationdata;
          this.buildingDetails = res.success.buildingdata;
          this.eletricityunitslist = res.success.energycostunits.electricitycostunits;
          this.fuelunitslist = res.success.energycostunits.fuelcostunits;
          this.genDetailsForm.patchValue(generalDetails);
          this.beetService.setSelectedCountry(generalDetails.country);
          this.locationlist = this.locationDetails.find(ele => ele.province == generalDetails.province).locations;
          if(generalDetails.buildingType != ''){
            this.spacesList = this.buildingDetails.find(ele => ele.buildingtype == generalDetails.buildingType).buildingspaces;
          }
          
        });
        //this.getGeneralData(generalDetails.country);
      }
    }
  }

 

  ngAfterViewInit() {
    
    var acc = this.document.getElementsByClassName('accordion');
    console.log(this.document.getElementsByClassName('accordion'));
    for (let i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }
  }

  getcountryList(): void {
    this.beetService.getCountries().subscribe(res => {
      this.countrylist = res.success.countrydetails;
    });
  }

  onChangeCountry(selectedCountry) {
    this.beetService.setSelectedCountry(selectedCountry.value);
    let target = selectedCountry.source.selected._element.nativeElement;
    let selectedData = {
      fieldId: target.getAttribute('data-id'),
      valueId: selectedCountry.value,
      value: target.innerText.trim()
    };
    sessionStorage.setItem('selectedCountryName', selectedData.value);
    this.selectedCountryCode = selectedCountry.value;
    this.getGeneralData(selectedCountry.value.toString());
  }

  getGeneralData(country: string) {
    this.beetService.getGeneralData(country).subscribe(res => {
      this.locationDetails = res.success.locationdata;
      this.buildingDetails = res.success.buildingdata;
      this.eletricityunitslist = res.success.energycostunits.electricitycostunits;
      this.fuelunitslist = res.success.energycostunits.fuelcostunits;
      this.beetService.setGeneralDetails(res);
    });
  }


  onChangeProvince(event) {
    this.locationlist = this.locationDetails.find(ele => ele.province == event.value).locations;

  }

  onChangeBuildingType(event) {
    this.spacesList = this.buildingDetails.find(ele => ele.buildingtype == event.value).buildingspaces;
  }


  calculateGross() {
    if (!this.isEnteredGross) {
      this.genDetailsForm.controls.grossAreaUnits.patchValue(this.genDetailsForm.controls.netAreaUnits.value);
      this.genDetailsForm.controls.buildingGrossArea.setValue((this.genDetailsForm.controls.netOccupiedFloorArea.value * 1.1).toFixed(2));
    }
  }


  resetGross(event) {
    if (event.target.value == '') {
      this.isEnteredGross = false;
    } else {
      this.isEnteredGross = true;
    }

  }

  onChangeOccupancy() {
    this.genDetailsForm.controls['occupantDensityKnown'].reset();
    this.genDetailsForm.controls['occupantDensityUnits'].reset();
    if (this.genDetailsForm.controls.occupantDensity.value == 1 && this.genDetailsForm.controls.noOfPeopleOccupying.value !== 0) {
      var payload: any = {
        noofpeople: this.genDetailsForm.controls.noOfPeopleOccupying.value,
        buildinggrossarea: Number(this.genDetailsForm.controls.buildingGrossArea.value),
        buildinggrossareaunit: this.genDetailsForm.controls.grossAreaUnits.value
      }
      this.beetService.postCalculateOccupancyPeople(payload).subscribe(res => {
        if (res.status == 'success') {
          this.genDetailsForm.controls['occupantDensityKnown'].patchValue(res.success.occupantdensity);
          this.genDetailsForm.controls['occupantDensityUnits'].patchValue(res.success.occupantdensityunit);
        }
      });
    }
    else if (this.genDetailsForm.controls.occupantDensity.value == 3) {
      var payload: any = {
        "countrycode": this.selectedCountryCode,
        "buildingtype": this.genDetailsForm.controls.buildingType.value,
        "buildingspaces": this.genDetailsForm.controls.buildingSpaces.value
      }
      this.beetService.postCalculateOccupancyUnknown(payload).subscribe(res => {
        this.genDetailsForm.controls['occupantDensityKnown'].setValue(res.success.occupantdensity);
        this.genDetailsForm.controls['occupantDensityUnits'].setValue(res.success.occupantdensityunit);
      });
    }


  }


}