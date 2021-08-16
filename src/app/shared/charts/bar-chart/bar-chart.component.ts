import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
barChartOptions: ChartOptions ={
  responsive: true,
};
barChartLabels: Label[] = ['CO2 baseline', 'Final CO2 emissions'];
barChartType: ChartType = 'bar';
barChartLegend = true;
barChartPlugins = [];

barChartData: ChartDataSets[] = [
  { data: [426, 356], label: 'CO2 emissions' }
];

  constructor() { }
  ngOnInit(): void {
  }
}
