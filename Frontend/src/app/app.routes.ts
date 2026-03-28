import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { MetersComponent } from './pages/meters/meters';
import { LinesComponent } from './pages/lines/lines';
import { MeterDetailComponent } from './pages/meter-detail/meter-detail'; 

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'meters', component: MetersComponent },
      { path: 'lines', component: LinesComponent },
      { path: 'meters/:id', component: MeterDetailComponent } 
    ]
  },
  { path: '**', redirectTo: '' }
];