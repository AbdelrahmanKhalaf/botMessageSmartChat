import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BouquteRoutingModule } from './bouqute-routing.module';
import { AllBouquteComponent } from './all-bouqute/all-bouqute.component';
import { DetailsBoquteComponent } from './details-boqute/details-boqute.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddBouquteComponent } from './add-bouqute/add-bouqute.component';


@NgModule({
  declarations: [
    AllBouquteComponent,
    DetailsBoquteComponent,
    AddBouquteComponent
  ],
  imports: [
    CommonModule,
    BouquteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class BouquteModule { }
