import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcceptComponent } from './accept/accept.component';
import { AllUsersWitAcceptComponent } from './all-users-wit-accept/all-users-wit-accept.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { AddActionComponent } from './chat/add-action/add-action.component';
import { SettingChatUserComponent } from './chat/setting-chat-user/setting-chat-user.component';
import { DetailsUserComponent } from './details-user/details-user.component';

const routes: Routes = [
  { path: "all-users", component: AllUsersComponent },
  { path: "users-wit-accept", component: AllUsersWitAcceptComponent },
  { path: "users-accept", component: AcceptComponent },
  { path: "users-accept/details-users/:id", component: DetailsUserComponent },
  { path: "users-accept/details-users/chat/:id", component: SettingChatUserComponent },
  { path: "users-accept/details-users/addAction/:id", component: AddActionComponent },
  { path: "users-wit-accept/details-users/:id", component: DetailsUserComponent },
  { path: "users-wit-accept/details-users/chat/:id", component: SettingChatUserComponent },
  { path: "users-wit-accept/details-users/addAction/:id", component: AddActionComponent },
  { path: "all-users/details-users/:id", component: DetailsUserComponent },
  { path: "all-users/details-users/chat/:id", component: SettingChatUserComponent },
  { path: "all-users/details-users/addAction/:id", component: AddActionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
