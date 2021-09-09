import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBouquteComponent } from './add-bouqute/add-bouqute.component';
import { AllBouquteComponent } from './all-bouqute/all-bouqute.component';
import { DetailsBoquteComponent } from './details-boqute/details-boqute.component';

const routes: Routes = [
  { path: "bouqute", component: AllBouquteComponent },
  { path: "bouqute/add-new", component: AddBouquteComponent },
  { path: "details-bouqute/:id", component: DetailsBoquteComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BouquteRoutingModule { }
