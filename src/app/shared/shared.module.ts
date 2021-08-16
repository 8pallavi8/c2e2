import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PieChartComponent } from './charts/pie-chart/pie-chart.component';
import { ChartsModule } from 'ng2-charts';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    PieChartComponent,
    BarChartComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ChartsModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ChartsModule,
    PieChartComponent,
    BarChartComponent
  ],
})
export class SharedModule { }
