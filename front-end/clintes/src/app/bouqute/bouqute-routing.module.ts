import { AllComponent } from './all/all.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:"bouqute/all",component:AllComponent},
  {path:"boqute/details-bouqute",component:AllComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BouquteRoutingModule { }
