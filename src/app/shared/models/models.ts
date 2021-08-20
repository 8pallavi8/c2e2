export interface DistTransformer {
    Requestnumber?: number;
    Country?: string;
    Power?: number;
    Stock?: number;
    PlateEfficiency?: number;
    Energy?: number;
    EnergyPrice?: number;
    PolicyLevel?: number;
    FireRegulation?: string;
    HighestVoltageValues?: string;
    DualVoltWindings?: string;
    Capex?: number;
}


  export interface DialogData {
    highestVoltageValueslist?: string[];
    dualVoltWindings?: String[];
    requestCount?: number;
  }

export interface TotalFinalValues {
    totalefficacy?: number,
    totalll?: number,
    totalnl?: number,
    totalenergyeffyincrease?: number,
    totalenergy?: number,
    totalfinancial?: number,
    totalpaybackperiod?: number,
    totalco2baseline?: number,
    totalco2savingston?: number,
    totalco2savingspercent?: number,
    totalfinalco2emissions?: number,
}

export interface FinalValues {
    efficacy?: number;
    ll?: number;
    nl?: number
    energyeffyincrease?: number;
    energy?: number;
    financial?: number;
    paybackperiod?: number;
    co2baseline?: number;
    co2savingston?: number;
    co2savingspercent?: number;
    finalco2emissions?: number;
}

