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
export interface BeetReportResponse{

    country?: string,
    province?: string,
    location?: string,
    buildingType?: string,
    buildingSpaces: string[]
    buildingGrossArea: string,
    grossAreaUnits : string,
    netOccupiedFloorArea: number,
    netAreaUnits: string,
    noOfFloors: number,
    occupanyHoursPerWeek: number,
    occupantDensity: number,
    noOfPeopleOccupying: number,
    occupantDensityKnown: number,
    occupantDensityUnits: string,
    electricityCost: number,
    fuelCost: number,
    fuelUnits: string,
    electricityUnits: string

}

export interface ErrorMessage{
  key?: string;
  errMessage?: string;
}

export const errorMessages:ErrorMessage[] = [
  {key: 'country', errMessage: 'Please select a country'},
  {key: 'province', errMessage: 'Please select a province'},
  {key: 'location', errMessage: 'Please select a location'},
  {key: 'buildingType', errMessage: 'Please select  buildingType'},
  {key: 'buildingSpaces', errMessage: 'Please select  buildingSpaces'},
  {key: 'netOccupiedFloorArea', errMessage: 'Please enter Total built up Area'},
  {key: 'netAreaUnits', errMessage: 'Please select Total built up Area Units'},
  {key: 'noOfFloors', errMessage: 'Please enter number of floors in building'},
  {key: 'occupanyHoursPerWeek', errMessage: 'Please enter occupancy hours per week'},
  {key: 'noOfPeopleOccupying', errMessage: 'Please enter number of people'},
  {key: 'occupantDensity', errMessage: 'Please select  occupant density option'},
  {key: 'occupantDensityKnown', errMessage: 'Please enter  occupant density value'},
  {key: 'occupantDensityUnits', errMessage: 'Please select occupant density units'},
  {key: 'electricityCost', errMessage: 'Please enter electricity cost value'},
  {key: 'fuelCost', errMessage: 'Please enter fuel cost value'},
  {key: 'fuelUnits', errMessage: 'Please select fuel units'},
  {key: 'electricityUnits', errMessage: 'Please select electricity units'},
  {key: 'outerwallr', errMessage: 'Please select outerwall R option'},
  {key: 'outerwallRKnown', errMessage: 'Please enter outerwall R value'},
  {key: 'rimages', errMessage: 'Please select image for outer wall R'},
  {key: 'rValueAdvanced', errMessage: 'Please enter outer wall Advanced R value'},
  {key: 'roofr', errMessage: 'Please select Roof R option'},
  {key: 'roofRKnown', errMessage: 'Please enter roof R value'},
  {key: 'roofrimages', errMessage: 'Please select image roof R'},
  {key: 'rroofValueAdvanced', errMessage: 'Please enter roof Advanced R value'},
  {key: 'windowr', errMessage: 'Please select Window R option'},
  {key: 'windowRKnown', errMessage: 'Please enter window R value'},
  {key: 'windowRCaluclated', errMessage: 'Please enter values to calculate window R value'},
  {key: 'SHGC', errMessage: 'Please select SHGC option'},
  {key: 'SHGCknown', errMessage: 'Please enter SHGC value'},
  {key: 'wwr', errMessage: 'Please select WWR option'},
  {key: 'wwrKnown', errMessage: 'Please enter WWR value'},
  {key: 'SHGCknown', errMessage: 'Please enter SHGC value'},
  {key: 'wwrGuide', errMessage: 'Please enter WWR value from guided images'},
  {key: 'heatefficiency', errMessage: 'Please select heating efficiency option'},
  {key: 'heatefficiencyKnown', errMessage: 'Please enter heating efficiency value'},
  {key: 'heatEfficiencyUnits', errMessage: 'Please select heating efficiency units option'},
  {key: 'heatValueImages', errMessage: 'Please select heating efficiency image option'},
  {key: 'heatEquipmentName', errMessage: 'Please select heating efficiency image name option'},
  {key: 'heatValueImages', errMessage: 'Please enter heating efficiency value'},
  {key: 'heatefficiency', errMessage: 'Please select heating efficiency units option'},
  {key: 'heatEfficiencyUnits', errMessage: 'Please select heating efficiency image option'},
  {key: 'airconditioning', errMessage: 'Please select cooling efficiency option'},
  {key: 'acEfficiencyValue', errMessage: 'Please enter cooling efficiency value'},
  {key: 'acEfficiencyParameter', errMessage: 'Please select cooling Efficiency Parameter option'},
  {key: 'coolImages', errMessage: 'Please select cooling efficiency image option'},
  {key: 'coolingEquipmentName', errMessage: 'Please select cooling efficiency image name option'},
  {key: 'acEfficiencyUnits', errMessage: 'Please enter cooling efficiency units value'},
  {key: 'ventilation', errMessage: 'Please select ventilation option'},
  {key: 'ventilationValue', errMessage: 'Please enter ventilationValue value'},
  {key: 'ventilationUnits', errMessage: 'Please select ventilation Units option'},
  {key: 'infiltration', errMessage: 'Please select infiltration value'},
  {key: 'infiltrationValue', errMessage: 'Please enter infiltration value'},
  {key: 'infiltrationUnits', errMessage: 'Please select infiltration Units options'},
  {key: 'economizer', errMessage: 'Please select economizer option'},
  {key: 'avgIndoorAirTemp', errMessage: 'Please select average Indoor AirTemperature option'},
  {key: 'avgIndoorAirTempUnit', errMessage: 'Please select average Indoor Air Temperature Unit option'},
  {key: 'hvacCompressorInstalled', errMessage: 'Please select hvac Compressor Installed option'},
  {key: 'hvacFansandBlowersInstalled', errMessage: 'Please select hvac Fans and Blowers Installed option'},
  {key: 'plugloads', errMessage: 'Please select plugloads option'},
  {key: 'plugLoadValueKnown', errMessage: 'Please enter plugLoad value'},
  {key: 'plugLoadUnits', errMessage: 'Please select plugLoad Units option'},
  {key: 'powergenerationco2emmisions', errMessage: 'Please select power generation CO2emmisions option'},
  {key: 'gridemissionsFactor', errMessage: 'Please enter grid emission value'},
  {key: 'gridemissionsFactorUnits', errMessage: 'Please select grid emission units option'},
  {key: 'fuelEmissionFactor', errMessage: 'Please select fuel emission factor option'},
  {key: 'fuelEmissionFactorValue', errMessage: 'Please enter fuel emission factor value'},
  {key: 'fuelEmissionFactorUnit', errMessage: 'Please select fuel emission factor units option'},
]