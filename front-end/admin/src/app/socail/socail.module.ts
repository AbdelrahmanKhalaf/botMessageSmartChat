import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocailRoutingModule } from './socail-routing.module';
import { AllSocailComponent } from './all-socail/all-socail.component';
import { AddSocailComponent } from './add-socail/add-socail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AllSocailComponent,
    AddSocailComponent
  ],
  imports: [
    CommonModule,
    SocailRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SocailModule { }
