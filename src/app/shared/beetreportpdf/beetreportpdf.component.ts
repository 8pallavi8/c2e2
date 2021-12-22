import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChartOptions, ChartType } from 'chart.js';
import jsPDF from 'jspdf';
import { Color, Label } from 'ng2-charts';
import { BEETComponent } from 'src/app/modules/BEET/beet.component';
import { BuildingenvelopedetailsComponent } from 'src/app/modules/BEET/buildingenvelopedetails/buildingenvelopedetails.component';
import { CO2EmissionsComponent } from 'src/app/modules/BEET/co2-emissions/co2-emissions.component';
import { GendetailsComponent } from 'src/app/modules/BEET/gendetails/gendetails.component';
import { HvacComponent } from 'src/app/modules/BEET/hvac/hvac.component';
import { LightingComponent } from 'src/app/modules/BEET/lighting/lighting.component';
import { PlugloadsComponent } from 'src/app/modules/BEET/plugloads/plugloads.component';
import { DialogData } from '../models/models';
import { beetService } from '../services/beet.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-beetreportpdf',
  templateUrl: './beetreportpdf.component.html',
  styleUrls: ['./beetreportpdf.component.scss']
})
export class BeetreportpdfComponent implements OnInit {
  genDetailsComponent: GendetailsComponent;
  buildingdetailsComponent: BuildingenvelopedetailsComponent;
  lightingDetailsComponent: LightingComponent;
  co2EmissionsDetailsComponent: CO2EmissionsComponent;
  hvacDetailsComponent: HvacComponent;
  plugLoaDetailsComponent: PlugloadsComponent;
  beetComponent: BEETComponent;
  selectedcountryname:string;
  submitResponse: any;
  barChartLabels: Label[] = ['Total Energy [kWh/m²]', 'Heating Energy [m³N.G/m²]', 'Electric [kWh/m²]', 'Electric Peak [kW/m²]', 'Total Cost [$/m²]'];
  barChartLabels2: Label[] = ['Heating', 'Cooling'];
  barChartLabels3: Label[] = ['Lights', 'Plugs', 'fans'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartOptions: ChartOptions = {
    responsive: true,
    legend: { display: false },
  };

  barChartColors: Color[] = [
    {
      backgroundColor: '#FF7D00'
    },
    {
      backgroundColor: '#3cd070'
    }
  ];
  barChartData: { data: any[]; label: string; }[];
  barChartData2: { data: any[]; label: string; barThickness: number; }[];
  barChartData3: { data: any[]; label: string; barThickness: number }[];
  ispdfloading:boolean= false;
  isGenerating:boolean=false;
 curDate=new Date();
  
 

  constructor(private beetService: beetService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BeetreportpdfComponent>) { 
     this.submitResponse = data;
     console.log("response :  "+this.submitResponse)
     this.initiazeDialog();
    }
  ngOnInit(): void {
    this.ispdfloading= true;
    this.beetComponent = this.beetService.getBEETParentComponent();
    this.selectedcountryname =  this.beetComponent.selectedcountryname
    this.genDetailsComponent = this.beetComponent.genDetailsComponent;
     this.buildingdetailsComponent = this.beetComponent.buildingdetailsComponent;
    this.plugLoaDetailsComponent = this.beetComponent.plugLoaDetailsComponent;
    this.lightingDetailsComponent = this.beetComponent.lightingDetailsComponent;
    this.hvacDetailsComponent = this.beetComponent.hvacDetailsComponent;
    this.co2EmissionsDetailsComponent = this.beetComponent.co2EmissionsDetailsComponent; 
    console.log("Data :: "+this.submitResponse);
    this.ispdfloading=false;
  }

  initiazeDialog(): void {

  }


  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getPDF() {
    this.isGenerating = true;
    await this.delay(3000);
    let general = document.getElementById('general-section');
    let baseline = document.getElementById('baseline-potential');
    let hvac = document.getElementById('hvac');
    let lightining = document.getElementById('lightining');

    var pdf = new jsPDF('p', 'pt', [1200, 1800]);
   
    pdf.setFontSize(30);
    pdf.setTextColor(231, 76, 60)
    pdf.setDrawColor(173,216,230)
    pdf.setCreationDate();

    //pdf.text(curDate.toDateString(),50,65);
    this.generateCanvas(pdf, general, 40, false);
    this.generateCanvas(pdf, baseline, 40, false);
    this.generateCanvas(pdf, hvac, 40, true);
    this.isGenerating = false;
  };

  generateCanvas(pdf, sectionDiv, top_left_margin, savePDF) {
    var HTML_Width = sectionDiv.offsetWidth;
    var HTML_Height = sectionDiv.offsetHeight;
    console.log("HTML Weight height " + HTML_Width + "    " + HTML_Height);
    var PDF_Width = HTML_Width + (top_left_margin * 2);
    var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height;

    var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
    html2canvas(sectionDiv).then(function (canvas) {
      canvas.getContext('2d');
      console.log(canvas.height + "  " + canvas.width);
      var imgData = canvas.toDataURL("image/jpeg", 1.0);
      pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
      if (savePDF != true) {
        pdf.addPage()
      }
      if (savePDF == true) {
        pdf.save("Beet-Report.pdf");
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


