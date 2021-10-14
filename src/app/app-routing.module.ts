import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';

const routes: Routes = [
  {
    path: '', component: AppLayoutComponent,
    children: [
      {
        path: 'transformer',
        loadChildren: () => import('./modules/distribution-transformer/distribution-transformer.module').then(m => m.DistributionTransformerModule)
      },
      {
        path: 'building',
        loadChildren: () => import('./modules/BEET/BEET.module').then(m => m.BEETModule)
      },
      {
        path: '**',
        redirectTo: 'transformer',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
