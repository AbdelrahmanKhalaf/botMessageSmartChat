import { DetailsBouquteComponent } from './details-bouqute/details-bouqute.component';
import { AllComponent } from './all/all.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BouquteRoutingModule } from './bouqute-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AllComponent,
    DetailsBouquteComponent
  ],
  imports: [
    CommonModule,
    BouquteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class BouquteModule { }
