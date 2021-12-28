import { Component, Inject, Input, OnInit, SimpleChanges } from '@angular/core';
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
import { BeetReportResponse } from '../models/beet-models';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BeetreportComponent } from 'src/app/modules/BEET/beetreport/beetreport.component';

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
  beetReportComponent: BeetreportComponent;
  selectedcountryname: string;

  barChartLabels: Label[] = ['Total Energy [kWh/m²]', 'Heating Energy [m³N.G/m²]', 'Electric [kWh/m²]', 'Electric Peak [kW/m²]', 'Total Cost [$/m²]'];
  barChartLabels2: Label[] = ['Heating', 'Cooling'];
  barChartLabels3: Label[] = ['Lights', 'Plugs', 'fans'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartOptions: ChartOptions = {
    responsive: true,
    legend: { display: true },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'ARS/year'
        }
      }]
    }
  };
  barChartOptionsperformance: ChartOptions = {
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
  ispdfloading: boolean = false;
  isGenerating: boolean = false;
  curDate = new Date();
  pdfInputForm = new FormControl();
  checked = false;
  beetReportForm:FormGroup;


  constructor(private beetService: beetService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public parentData: any,
    public dialogRef: MatDialogRef<BeetreportpdfComponent>) {

  } 
  ngOnInit(): void {
    
    this.initiazeDialog();
  }
  ngAfterViewInit() {
   // this.initiazeDialog();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
  }  
  onToggleChange(event) {
    console.log(this.pdfInputForm.value);
  } 
  initiazeDialog(): void {
    this.beetComponent = this.beetService.getBEETParentComponent();
    this.ispdfloading = true;
    this.beetComponent = this.beetService.getBEETParentComponent();
    this.selectedcountryname = this.beetComponent.selectedcountryname
    this.genDetailsComponent = this.beetComponent.genDetailsComponent;
    this.buildingdetailsComponent = this.beetComponent.buildingdetailsComponent;
    this.plugLoaDetailsComponent = this.beetComponent.plugLoaDetailsComponent;
    this.lightingDetailsComponent = this.beetComponent.lightingDetailsComponent;
    this.hvacDetailsComponent = this.beetComponent.hvacDetailsComponent;
    this.co2EmissionsDetailsComponent = this.beetComponent.co2EmissionsDetailsComponent;
    this.beetReportComponent= this.beetComponent.beetReportComponent;

    this.ispdfloading = false;
  }


  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

   getPDF() {
    this.isGenerating = true;
    //await this.delay(3000);
    let general = document.getElementById('pdf-general-section');
    let construction = document.getElementById('pdf-construction');
    let hvacpdf = document.getElementById('pdf-hvac');
    



    var pdf = new jsPDF('p', 'pt', [1200, 1800]);

    pdf.setFontSize(30);
    pdf.setTextColor(231, 76, 60)
    pdf.setDrawColor(173, 216, 230)
    pdf.setCreationDate();

    //pdf.text(curDate.toDateString(),50,65);
    this.generateCanvas(pdf, general, 40, false);
    this.generateCanvas(pdf, construction, 40, false);
    this.generateCanvas(pdf, hvacpdf, 40, true);
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


