import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllComponent } from './all/all.component';
import { DetailsBouquteComponent } from './details-bouqute/details-bouqute.component';

const routes: Routes = [
  {path:"all" , component:AllComponent},
  {path:"details" , component:DetailsBouquteComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoqoutesRoutingModule { }
