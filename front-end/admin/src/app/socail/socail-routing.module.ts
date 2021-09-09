import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSocailComponent } from './add-socail/add-socail.component';
import { AllSocailComponent } from './all-socail/all-socail.component';

const routes: Routes = [
  { path: "socail", component: AllSocailComponent },
  { path: "socail/add-new", component: AddSocailComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocailRoutingModule { }
