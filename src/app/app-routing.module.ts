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
        path: 'district-energy',
        loadChildren: () => import('./modules/district-energy/district-energy.module').then(m => m.DistrictEnergyModule)
      },
      {
        path: 'motor',
        loadChildren: () => import('./modules/motor/motor.module').then(m => m.MotorModule)
      },
      {
        path: 'motor-pump',
        loadChildren: () => import('./modules/motor-pump/motor-pump.module').then(m => m.MotorPumpModule)
      },
      {
        path: 'street-light',
        loadChildren: () => import('./modules/street-light/street-light.module').then(m => m.StreetLightModule)
      },
      {
        path: 'water-supply',
        loadChildren: () => import('./modules/water-supply/water-supply.module').then(m => m.WaterSupplyModule)
      },
      {
        path: '**',
        loadChildren: () => import('./modules/landingpage/landingpage.module').then(m => m.LandingpageModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
