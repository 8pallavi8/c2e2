export interface textboxinputs {
    textBoxData?: string[];
    title?: string;
}

export interface Summary{
  generaldetails?: GeneralDetails;
}

export interface GeneralDetails {
    username?: string;
    projectname?: string;
    country?: string;
    province?: string;
    location?: string;
    buildingtype?: string;
    buildingspaces?: string[];
    yearofconstruction?: string;
    buildinggrossarea?: number;
    buildinggrossareaunit?: string;
    netoccupiedarea?: number;
    netoccupiedareaunit?: string;
    nooffloors?: number;
    occupancyhrsperweek?: number;
    occupantdensity?: number;
    occupantdensityunit?: string;
    electricitycost?: number;
    electricitycostunit?: string;
    fuelcost?: number;
    fuelcostunit?: string;
}


export interface ErrorMessage{
  key?: string;
  errMessage?: string;
}

export const errorMessages:ErrorMessage[] = [
  {key: 'country', errMessage: 'Please select a country'},
  {key: 'province', errMessage: 'Please select a province'},
  {key: 'location', errMessage: 'Please select a location'},
]