import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisTransformerComponent } from './distribution-transformer/distribution-transformer.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
      path: '',
      component: DisTransformerComponent
  }
];


@NgModule({
  declarations: [DisTransformerComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ToolsModule { }
