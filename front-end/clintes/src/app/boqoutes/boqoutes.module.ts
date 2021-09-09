import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoqoutesRoutingModule } from './boqoutes-routing.module';
import { AllComponent } from './all/all.component';
import { DetailsBouquteComponent } from './details-bouqute/details-bouqute.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AllComponent,
    DetailsBouquteComponent
  ],
  imports: [
    CommonModule,
    BoqoutesRoutingModule,
    FormsModule, ReactiveFormsModule

  ]
})
export class BoqoutesModule { }
