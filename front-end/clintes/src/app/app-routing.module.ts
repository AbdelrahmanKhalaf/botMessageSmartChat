import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: "user", loadChildren:()=>import ('./user/user.module').then(m => m.UserModule),},
  { path: "auth", loadChildren:()=>import ('./auth/auth.module').then(m => m.AuthModule),},
  { path: "bouqute", loadChildren:()=>import ('./bouqute/bouqute.module').then(m => m.BouquteModule),},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
