import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { SettingChatUserComponent } from './chat/setting-chat-user/setting-chat-user.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { AllUsersWitAcceptComponent } from './all-users-wit-accept/all-users-wit-accept.component';
import { DetailsUserComponent } from './details-user/details-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AcceptComponent } from './accept/accept.component';
import { AddActionComponent } from './chat/add-action/add-action.component';


@NgModule({
  declarations: [
    SettingChatUserComponent,
    AllUsersComponent,
    AllUsersWitAcceptComponent,
    DetailsUserComponent,
    AcceptComponent,
    AddActionComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class UsersModule { }
