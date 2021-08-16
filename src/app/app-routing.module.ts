import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '', component: AppComponent,
    children: [
      {
        path: 'tools',
        loadChildren: () => import('./modules/tools/tools.module').then(m => m.ToolsModule)
      },
      {
        path: '',
        redirectTo: 'tools',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: 'tools',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
