import { ChatComponent } from './profile/chat/chat.component';
import { DetailsComponent } from './profile/details/details.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:"user/profile", component:DetailsComponent},
  {path:"user/chat", component:ChatComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
